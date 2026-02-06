import { NextRequest, NextResponse } from 'next/server'
import parseLLMJson from '@/lib/jsonParser'

const LYZR_API_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'
const LYZR_API_KEY = process.env.LYZR_API_KEY || ''

// Request queue to prevent simultaneous API calls
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1500 // Minimum 1.5 seconds between requests

async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    console.log(`Rate limit protection: waiting ${waitTime}ms before next request`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  lastRequestTime = Date.now()
}

// Types
interface NormalizedAgentResponse {
  status: 'success' | 'error'
  result: Record<string, any>
  message?: string
  metadata?: {
    agent_name?: string
    timestamp?: string
    [key: string]: any
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function normalizeResponse(parsed: any): NormalizedAgentResponse {
  if (!parsed) {
    return {
      status: 'error',
      result: {},
      message: 'Empty response from agent',
    }
  }

  if (typeof parsed === 'string') {
    return {
      status: 'success',
      result: { text: parsed },
      message: parsed,
    }
  }

  if (typeof parsed !== 'object') {
    return {
      status: 'success',
      result: { value: parsed },
      message: String(parsed),
    }
  }

  if ('status' in parsed && 'result' in parsed) {
    return {
      status: parsed.status === 'error' ? 'error' : 'success',
      result: parsed.result || {},
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('status' in parsed) {
    const { status, message, metadata, ...rest } = parsed
    return {
      status: status === 'error' ? 'error' : 'success',
      result: Object.keys(rest).length > 0 ? rest : {},
      message,
      metadata,
    }
  }

  if ('result' in parsed) {
    return {
      status: 'success',
      result: parsed.result,
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('message' in parsed && typeof parsed.message === 'string') {
    return {
      status: 'success',
      result: { text: parsed.message },
      message: parsed.message,
    }
  }

  if ('response' in parsed) {
    return normalizeResponse(parsed.response)
  }

  return {
    status: 'success',
    result: parsed,
    message: undefined,
    metadata: undefined,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, agent_id, user_id, session_id, assets } = body

    if (!message || !agent_id) {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'message and agent_id are required',
          },
          error: 'message and agent_id are required',
        },
        { status: 400 }
      )
    }

    if (!LYZR_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'LYZR_API_KEY not configured',
          },
          error: 'LYZR_API_KEY not configured on server',
        },
        { status: 500 }
      )
    }

    const finalUserId = user_id || `user-${generateUUID()}`
    const finalSessionId = session_id || `${agent_id}-${generateUUID().substring(0, 12)}`

    const payload: Record<string, any> = {
      message,
      agent_id,
      user_id: finalUserId,
      session_id: finalSessionId,
    }

    if (assets && assets.length > 0) {
      payload.assets = assets
    }

    // Wait for rate limit protection before first attempt
    await waitForRateLimit()

    // Aggressive retry logic for rate limiting (429 errors)
    let response: Response
    let rawText: string
    let maxRetries = 8 // Increased to 8 retries
    let currentAttempt = 0
    let delay = 3000 // Start with 3 seconds

    while (currentAttempt <= maxRetries) {
      try {
        response = await fetch(LYZR_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': LYZR_API_KEY,
          },
          body: JSON.stringify(payload),
        })

        rawText = await response.text()

        // If successful or non-rate-limit error, break out of retry loop
        if (response.status !== 429) {
          break
        }

        // If rate limited and retries remain, wait and retry
        if (currentAttempt < maxRetries) {
          console.log(`Rate limited (429), retrying in ${delay}ms... (attempt ${currentAttempt + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          // More aggressive exponential backoff: 3s, 4.5s, 6.75s, 10s, 15s, 20s, 30s, 45s
          delay = Math.min(delay * 1.5, 45000) // Exponential backoff, max 45 seconds
          currentAttempt++
        } else {
          // Last retry failed, return error
          return NextResponse.json(
            {
              success: false,
              response: {
                status: 'error',
                result: {},
                message: 'Service is experiencing very high demand. The system tried 9 times over 2+ minutes. Please wait and try again.',
              },
              error: 'Rate limit exceeded after multiple retries',
              details: `Attempted ${maxRetries + 1} times with extended delays. The API may be temporarily overloaded.`,
            },
            { status: 429 }
          )
        }
      } catch (fetchError) {
        // Network error during retry
        if (currentAttempt < maxRetries) {
          console.log(`Network error during attempt ${currentAttempt + 1}, retrying...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay = Math.min(delay * 1.5, 45000)
          currentAttempt++
        } else {
          throw fetchError
        }
      }
    }

    if (response.ok) {
      const parsed = parseLLMJson(rawText)

      if (parsed?.success === false && parsed?.error) {
        return NextResponse.json({
          success: false,
          response: {
            status: 'error',
            result: {},
            message: parsed.error,
          },
          error: parsed.error,
          raw_response: rawText,
        })
      }

      const normalized = normalizeResponse(parsed)

      return NextResponse.json({
        success: true,
        response: normalized,
        agent_id,
        user_id: finalUserId,
        session_id: finalSessionId,
        timestamp: new Date().toISOString(),
        raw_response: rawText,
      })
    } else {
      let errorMsg = `API returned status ${response.status}`
      try {
        const errorData = parseLLMJson(rawText) || JSON.parse(rawText)
        errorMsg = errorData?.error || errorData?.message || errorMsg
      } catch {}

      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: errorMsg,
          },
          error: errorMsg,
          raw_response: rawText,
        },
        { status: response.status }
      )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json(
      {
        success: false,
        response: {
          status: 'error',
          result: {},
          message: errorMsg,
        },
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}
