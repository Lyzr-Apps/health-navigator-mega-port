'use client'

/**
 * Video Consultation Page
 * Secure video consultation interface with chat sidebar
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaHeartbeat, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone, FaPaperPlane, FaSpinner } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { callAIAgent } from '@/lib/aiAgent'

// Agent ID from workflow_state.json
const VIDEO_ESCALATION_AGENT_ID = '698598fa1caa4e686dd66f97'

interface VideoSession {
  video_session: {
    room_id: string
    room_name: string
    patient_token: string
    doctor_token: string
    expires_at: string
    max_participants: number
  }
  session_config: {
    recording_enabled: boolean
    encryption_enabled: boolean
    max_duration_minutes: number
  }
  session_metadata: {
    urgency_level: string
    session_type: string
    created_at: string
  }
  join_urls: {
    patient_url: string
    doctor_url: string
  }
}

interface ChatMessage {
  id: string
  sender: 'patient' | 'doctor'
  message: string
  timestamp: Date
}

export default function VideoPage() {
  const [loading, setLoading] = useState(true)
  const [videoSession, setVideoSession] = useState<VideoSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')

  useEffect(() => {
    initializeVideoSession()
  }, [])

  useEffect(() => {
    // Session timer
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const initializeVideoSession = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await callAIAgent(
        'Create a video consultation session for a moderate urgency patient.',
        VIDEO_ESCALATION_AGENT_ID
      )

      if (result.success && result.response.status === 'success') {
        setVideoSession(result.response.result as VideoSession)
        // Add initial system message
        setChatMessages([
          {
            id: '1',
            sender: 'doctor',
            message: 'Welcome to your video consultation. A healthcare professional will join shortly.',
            timestamp: new Date(),
          },
        ])
      } else {
        setError(result.error || 'Failed to create video session')
      }
    } catch (err) {
      setError('An unexpected error occurred while initializing the video session')
      console.error('Video session error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'patient',
        message: messageInput,
        timestamp: new Date(),
      }
      setChatMessages([...chatMessages, newMessage])
      setMessageInput('')
    }
  }

  const endCall = () => {
    if (confirm('Are you sure you want to end this consultation?')) {
      window.location.href = '/results'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <FaHeartbeat className="text-[#0077B6] text-3xl" />
              <h1 className="text-2xl font-bold text-gray-900">HealthNavigator</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-[#0077B6] font-medium">
                Home
              </Link>
              <Link href="/history" className="text-gray-700 hover:text-[#0077B6] font-medium">
                History
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-[#0077B6] font-medium">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <FaSpinner className="animate-spin text-[#0077B6] text-5xl mx-auto mb-4" />
              <p className="text-gray-600">Setting up your video consultation...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={initializeVideoSession} className="bg-[#0077B6] hover:bg-[#005F8D]">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : videoSession ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Video Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Session Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Video Consultation</h2>
                  <p className="text-sm text-gray-600">
                    Session: {videoSession.video_session.room_name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-[#48CAE4] text-white">
                    {videoSession.session_metadata.urgency_level}
                  </Badge>
                  {videoSession.session_config.encryption_enabled && (
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Encrypted
                    </Badge>
                  )}
                  {videoSession.session_config.recording_enabled && (
                    <Badge variant="outline" className="border-red-500 text-red-700">
                      Recording
                    </Badge>
                  )}
                </div>
              </div>

              {/* Video Frame */}
              <Card>
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video rounded-lg flex items-center justify-center relative">
                    <FaVideo className="text-gray-600 text-9xl opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <FaVideo className="text-6xl mx-auto mb-4 opacity-50" />
                        <p className="text-xl font-semibold mb-2">Video Consultation Active</p>
                        <p className="text-sm text-gray-400">Twilio Video Integration - Coming Soon</p>
                      </div>
                    </div>

                    {/* Session Timer */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
                      </div>
                    </div>

                    {/* Max Duration Warning */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
                      Max: {videoSession.session_config.max_duration_minutes} min
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      variant={muted ? 'destructive' : 'default'}
                      className="rounded-full w-16 h-16"
                      onClick={() => setMuted(!muted)}
                    >
                      {muted ? <FaMicrophoneSlash className="text-2xl" /> : <FaMicrophone className="text-2xl" />}
                    </Button>
                    <Button
                      size="lg"
                      variant={videoOff ? 'destructive' : 'default'}
                      className="rounded-full w-16 h-16"
                      onClick={() => setVideoOff(!videoOff)}
                    >
                      {videoOff ? <FaVideoSlash className="text-2xl" /> : <FaVideo className="text-2xl" />}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="rounded-full w-16 h-16 bg-[#E63946] hover:bg-[#D62828]"
                      onClick={endCall}
                    >
                      <FaPhone className="text-2xl rotate-135" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                    <span>{muted ? 'Microphone Off' : 'Microphone On'}</span>
                    <span>•</span>
                    <span>{videoOff ? 'Camera Off' : 'Camera On'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'patient'
                                ? 'bg-[#0077B6] text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={sendMessage}
                        className="bg-[#0077B6] hover:bg-[#005F8D]"
                      >
                        <FaPaperPlane />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {/* Session Info Card */}
        {!loading && videoSession && (
          <Card className="max-w-4xl mx-auto mt-6">
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Room ID:</p>
                  <p className="font-mono">{videoSession.video_session.room_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Session Type:</p>
                  <p className="capitalize">{videoSession.session_metadata.session_type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Participants:</p>
                  <p>{videoSession.video_session.max_participants}</p>
                </div>
                <div>
                  <p className="text-gray-600">Expires At:</p>
                  <p>{new Date(videoSession.video_session.expires_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
