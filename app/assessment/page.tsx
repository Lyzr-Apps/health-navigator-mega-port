'use client'

/**
 * Symptom Assessment Page
 * Two-column form for collecting patient data and symptoms
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaHeartbeat, FaSpinner, FaClock } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { callAIAgent } from '@/lib/aiAgent'

// Agent ID from workflow_state.json
const TRIAGE_AGENT_ID = '698598b0a791e6e318b8df94'

interface FormData {
  age: string
  gender: string
  symptoms: string
  duration: string
  severity: number
  existingConditions: {
    diabetes: boolean
    hypertension: boolean
    asthma: boolean
    heartDisease: boolean
    other: boolean
  }
}

export default function AssessmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCountdown, setRetryCountdown] = useState<number>(0)
  const [loadingMessage, setLoadingMessage] = useState<string>('Analyzing symptoms...')
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    severity: 5,
    existingConditions: {
      diabetes: false,
      hypertension: false,
      asthma: false,
      heartDisease: false,
      other: false,
    },
  })

  // Countdown timer effect
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [retryCountdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setRetryCountdown(0)

    // Validation
    if (!formData.age || !formData.gender || !formData.symptoms || !formData.duration) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setLoadingMessage('Analyzing symptoms...')

    // Update loading message after 10 seconds to show retry is happening
    const messageTimer = setTimeout(() => {
      setLoadingMessage('Processing your request (this may take up to 2 minutes)...')
    }, 10000)

    try {
      // Build conditions list
      const conditions = Object.entries(formData.existingConditions)
        .filter(([_, checked]) => checked)
        .map(([condition, _]) => condition)
        .join(', ')

      // Create message for triage agent
      const message = `Patient Assessment:
Age: ${formData.age}
Gender: ${formData.gender}
Symptoms: ${formData.symptoms}
Duration: ${formData.duration}
Severity: ${formData.severity}/10
Existing Conditions: ${conditions || 'None'}

Please analyze these symptoms and provide a triage assessment.`

      const result = await callAIAgent(message, TRIAGE_AGENT_ID)

      if (result.success && result.response.status === 'success') {
        // Store assessment data in sessionStorage for results page
        sessionStorage.setItem('assessmentData', JSON.stringify(formData))
        sessionStorage.setItem('triageResult', JSON.stringify(result.response.result))

        // Navigate to results page
        router.push('/results')
      } else {
        // Handle specific error types
        if (result.error?.includes('rate limit') || result.error?.includes('429') || result.error?.includes('high demand')) {
          setError(result.response?.message || 'Service is experiencing very high demand. The system tried multiple times. Please wait and try again.')
          setRetryCountdown(90) // Start 90-second countdown (longer to give API time to recover)
        } else {
          setError(result.error || 'Failed to analyze symptoms. Please try again.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Assessment error:', err)
    } finally {
      clearTimeout(messageTimer)
      setLoading(false)
      setLoadingMessage('Analyzing symptoms...')
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

      {/* Assessment Form */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Symptom Assessment</CardTitle>
            <p className="text-gray-600 mt-2">
              Please provide detailed information about your symptoms. This will help us provide you with the most accurate guidance.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Demographics Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Existing Conditions */}
              <div className="space-y-3">
                <Label>Existing Medical Conditions</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabetes"
                      checked={formData.existingConditions.diabetes}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          existingConditions: { ...prev.existingConditions, diabetes: checked as boolean },
                        }))
                      }
                    />
                    <label htmlFor="diabetes" className="text-sm cursor-pointer">
                      Diabetes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hypertension"
                      checked={formData.existingConditions.hypertension}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          existingConditions: { ...prev.existingConditions, hypertension: checked as boolean },
                        }))
                      }
                    />
                    <label htmlFor="hypertension" className="text-sm cursor-pointer">
                      Hypertension
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asthma"
                      checked={formData.existingConditions.asthma}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          existingConditions: { ...prev.existingConditions, asthma: checked as boolean },
                        }))
                      }
                    />
                    <label htmlFor="asthma" className="text-sm cursor-pointer">
                      Asthma
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heartDisease"
                      checked={formData.existingConditions.heartDisease}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          existingConditions: { ...prev.existingConditions, heartDisease: checked as boolean },
                        }))
                      }
                    />
                    <label htmlFor="heartDisease" className="text-sm cursor-pointer">
                      Heart Disease
                    </label>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms in detail (e.g., 'I have severe chest pain that started suddenly 30 minutes ago...')"
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Symptom Duration *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1-hour">Less than 1 hour</SelectItem>
                    <SelectItem value="1-6-hours">1-6 hours</SelectItem>
                    <SelectItem value="6-24-hours">6-24 hours</SelectItem>
                    <SelectItem value="1-3-days">1-3 days</SelectItem>
                    <SelectItem value="3-7-days">3-7 days</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Severity Level</Label>
                  <span className="text-2xl font-bold text-[#0077B6]">{formData.severity}/10</span>
                </div>
                <Slider
                  value={[formData.severity]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value[0] }))}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-700 font-medium">{error}</p>
                      {(error.includes('high demand') || error.includes('rate limit') || error.includes('tried')) && (
                        <div className="mt-2">
                          <p className="text-red-600 text-sm">
                            The system automatically retried 9 times over 2+ minutes with increasing delays.
                          </p>
                          {retryCountdown > 0 ? (
                            <div className="flex items-center gap-2 mt-2">
                              <FaClock className="text-[#0077B6]" />
                              <p className="text-sm text-gray-700">
                                Please wait <span className="font-bold text-[#0077B6]">{retryCountdown}</span> seconds before retrying
                              </p>
                            </div>
                          ) : (
                            <p className="text-green-600 text-sm mt-2 font-medium">
                              You can now retry your submission
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || retryCountdown > 0}
                  className="flex-1 bg-[#0077B6] hover:bg-[#005F8D] text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        <span>{loadingMessage}</span>
                      </div>
                    </div>
                  ) : retryCountdown > 0 ? (
                    <>
                      <FaClock className="mr-2" />
                      Wait {retryCountdown}s to Retry
                    </>
                  ) : (
                    'Analyze Symptoms'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
