'use client'

/**
 * HealthNavigator AI Healthcare Platform
 * Landing Page with Hero Section and Feature Highlights
 */

import Link from 'next/link'
import { FaHeartbeat, FaVideo, FaMapMarkedAlt, FaExclamationTriangle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaHeartbeat className="text-[#0077B6] text-3xl" />
              <h1 className="text-2xl font-bold text-gray-900">HealthNavigator</h1>
            </div>
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

      {/* Emergency Disclaimer Banner */}
      <Alert className="container mx-auto mt-6 border-[#E63946] bg-red-50">
        <FaExclamationTriangle className="text-[#E63946]" />
        <AlertDescription className="text-[#E63946] font-medium">
          <strong>EMERGENCY DISCLAIMER:</strong> If you are experiencing a life-threatening emergency, call 911 or go to the nearest emergency room immediately. This service is for informational guidance only and not a substitute for professional medical advice.
        </AlertDescription>
      </Alert>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Healthcare Triage & Navigation
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get instant symptom analysis, risk assessment, and personalized medical guidance powered by advanced AI technology.
            </p>
            <Link href="/assessment">
              <Button size="lg" className="bg-[#0077B6] hover:bg-[#005F8D] text-white px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#0077B6] to-[#48CAE4] rounded-2xl h-96 flex items-center justify-center">
            <FaHeartbeat className="text-white text-9xl opacity-20" />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-[#0077B6] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaHeartbeat className="text-white text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-3">Symptom Triage</h4>
              <p className="text-gray-600">
                Advanced AI analyzes your symptoms to assess urgency levels and provide personalized recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-[#48CAE4] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaVideo className="text-white text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-3">Video Consultation</h4>
              <p className="text-gray-600">
                Connect with healthcare professionals through secure, encrypted video sessions when needed.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-[#E63946] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaMapMarkedAlt className="text-white text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-3">Hospital Finder</h4>
              <p className="text-gray-600">
                Locate the nearest emergency facilities with real-time traffic updates and estimated arrival times.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-4">
              <div className="bg-[#0077B6] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                1
              </div>
              <div>
                <h5 className="font-bold text-lg mb-2">Describe Your Symptoms</h5>
                <p className="text-gray-600">Provide details about your symptoms, duration, and severity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#48CAE4] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                2
              </div>
              <div>
                <h5 className="font-bold text-lg mb-2">AI Analysis</h5>
                <p className="text-gray-600">Our AI examines your symptoms and calculates a comprehensive risk score.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#E63946] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                3
              </div>
              <div>
                <h5 className="font-bold text-lg mb-2">Get Guidance</h5>
                <p className="text-gray-600">Receive actionable recommendations, emergency routing, or video consultation options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2026 HealthNavigator. This platform provides guidance only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
