'use client'

/**
 * Risk Result Page
 * Displays triage results with color-coded urgency, risk score, and action buttons
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaMapMarkedAlt, FaVideo } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface TriageResult {
  triage_summary: {
    urgency_level: string
    risk_score: number
    specialist_type: string
    red_flags_present: boolean
  }
  symptom_analysis: {
    primary_complaint: string
    structured_symptoms: Array<{
      name: string
      category: string
      body_system: string
      severity: string
      onset: string
      duration: string
    }>
    critical_patterns: string[]
  }
  recommendations: {
    primary_action: string
    action_steps: string[]
    show_emergency_map: boolean
    show_video_consult: boolean
  }
  disclaimer: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [reasoningExpanded, setReasoningExpanded] = useState(false)

  useEffect(() => {
    // Load triage result from sessionStorage
    const storedResult = sessionStorage.getItem('triageResult')
    if (storedResult) {
      setTriageResult(JSON.parse(storedResult))
    } else {
      // No result found, redirect to assessment
      router.push('/assessment')
    }
  }, [router])

  if (!triageResult) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-gray-600">Loading results...</p>
      </div>
    )
  }

  const { triage_summary, symptom_analysis, recommendations, disclaimer } = triageResult
  const urgencyLevel = triage_summary.urgency_level.toLowerCase()

  // Color coding based on urgency
  const urgencyColors = {
    high: {
      badge: 'bg-[#E63946] text-white',
      border: 'border-[#E63946]',
      bg: 'bg-red-50',
      text: 'text-[#E63946]',
    },
    moderate: {
      badge: 'bg-yellow-500 text-white',
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
    low: {
      badge: 'bg-green-500 text-white',
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
  }

  const colors = urgencyColors[urgencyLevel as keyof typeof urgencyColors] || urgencyColors.moderate

  // Risk score color
  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-[#E63946]'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Red Flag Alert Banner */}
          {triage_summary.red_flags_present && (
            <Alert className={`${colors.border} ${colors.bg}`}>
              <FaExclamationTriangle className={colors.text} />
              <AlertDescription className={`${colors.text} font-medium`}>
                <strong>CRITICAL RED FLAGS DETECTED:</strong> Your symptoms indicate potentially life-threatening conditions. Please follow the emergency recommendations below immediately.
              </AlertDescription>
            </Alert>
          )}

          {/* Urgency & Risk Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Urgency Level</p>
                  <Badge className={`${colors.badge} text-lg px-4 py-2`}>
                    {triage_summary.urgency_level}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Risk Score</p>
                  <div className={`text-5xl font-bold ${getRiskScoreColor(triage_summary.risk_score)}`}>
                    {triage_summary.risk_score}
                  </div>
                  <p className="text-sm text-gray-500">out of 100</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Recommended Specialist</p>
                  <p className="text-lg font-semibold">{triage_summary.specialist_type}</p>
                </div>
              </div>

              {/* Circular Risk Indicator */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={urgencyLevel === 'high' ? '#E63946' : urgencyLevel === 'moderate' ? '#EAB308' : '#22C55E'}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(triage_summary.risk_score / 100) * 553} 553`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getRiskScoreColor(triage_summary.risk_score)}`}>
                        {triage_summary.risk_score}%
                      </div>
                      <div className="text-sm text-gray-600">Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Complaint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Primary Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{symptom_analysis.primary_complaint}</p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className={urgencyLevel === 'high' ? `${colors.border} border-2` : ''}>
            <CardHeader>
              <CardTitle className="text-xl">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className={urgencyLevel === 'high' ? colors.bg : 'bg-blue-50'}>
                <FaInfoCircle className={urgencyLevel === 'high' ? colors.text : 'text-blue-600'} />
                <AlertDescription className={urgencyLevel === 'high' ? colors.text : 'text-blue-800'}>
                  <strong>{recommendations.primary_action}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-semibold">Action Steps:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {recommendations.action_steps.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {recommendations.show_emergency_map && (
                  <Link href="/map" className="flex-1">
                    <Button className="w-full bg-[#E63946] hover:bg-[#D62828] text-white py-6">
                      <FaMapMarkedAlt className="mr-2" />
                      Find Nearest Emergency Room
                    </Button>
                  </Link>
                )}
                {recommendations.show_video_consult && (
                  <Link href="/video" className="flex-1">
                    <Button className="w-full bg-[#48CAE4] hover:bg-[#0077B6] text-white py-6">
                      <FaVideo className="mr-2" />
                      Request Video Consultation
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expandable Reasoning */}
          <Collapsible open={reasoningExpanded} onOpenChange={setReasoningExpanded}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>Detailed Analysis</span>
                    <span className="text-sm text-gray-500">
                      {reasoningExpanded ? 'Hide' : 'Show'} Details
                    </span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {/* Structured Symptoms */}
                  <div>
                    <h4 className="font-semibold mb-3">Structured Symptoms:</h4>
                    <div className="space-y-2">
                      {symptom_analysis.structured_symptoms.map((symptom, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{symptom.name}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                            <p>Category: {symptom.category}</p>
                            <p>Body System: {symptom.body_system}</p>
                            <p>Severity: {symptom.severity}</p>
                            <p>Onset: {symptom.onset}</p>
                            <p>Duration: {symptom.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Patterns */}
                  {symptom_analysis.critical_patterns.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Critical Patterns Detected:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {symptom_analysis.critical_patterns.map((pattern, index) => (
                          <li key={index} className="text-gray-700">
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Disclaimer */}
          <Card className="border-gray-300">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 italic">{disclaimer}</p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href="/assessment" className="flex-1">
              <Button variant="outline" className="w-full">
                New Assessment
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
