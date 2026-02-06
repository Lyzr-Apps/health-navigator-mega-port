'use client'

/**
 * Map & ETA Page
 * Displays nearest hospital location with route information
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaHeartbeat, FaPhone, FaDirections, FaMapMarkerAlt, FaClock, FaRoad, FaSpinner } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { callAIAgent } from '@/lib/aiAgent'

// Agent ID from workflow_state.json
const LOCATION_ROUTING_AGENT_ID = '698598e3fe576c19864be921'

interface LocationResult {
  nearest_facility: {
    name: string
    address: string
    phone: string
    latitude: number
    longitude: number
    facility_type: string
  }
  route: {
    distance_miles: number
    eta_minutes: number
    traffic_status: string
    polyline: string
    directions: string[]
  }
  emergency_status: {
    available: boolean
    wait_time_minutes: number
    services: string[]
  }
}

export default function MapPage() {
  const [loading, setLoading] = useState(true)
  const [locationResult, setLocationResult] = useState<LocationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLocationData()
  }, [])

  const loadLocationData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call location & routing agent
      const result = await callAIAgent(
        'Find the nearest emergency room to my current location.',
        LOCATION_ROUTING_AGENT_ID
      )

      if (result.success && result.response.status === 'success') {
        setLocationResult(result.response.result as LocationResult)
      } else {
        setError(result.error || 'Failed to load location data')
      }
    } catch (err) {
      setError('An unexpected error occurred while loading location data')
      console.error('Location error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTrafficColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'light':
        return 'bg-green-500'
      case 'moderate':
        return 'bg-yellow-500'
      case 'heavy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
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
              <p className="text-gray-600">Finding nearest emergency facilities...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadLocationData} className="bg-[#0077B6] hover:bg-[#005F8D]">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : locationResult ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-[600px] rounded-lg flex items-center justify-center relative overflow-hidden">
                    <FaMapMarkerAlt className="text-gray-400 text-9xl opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                        <FaMapMarkerAlt className="text-[#E63946] text-5xl mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">{locationResult.nearest_facility.name}</p>
                        <p className="text-sm text-gray-600">{locationResult.nearest_facility.address}</p>
                        <p className="text-sm text-gray-500 mt-4">
                          Google Maps Integration - Coming Soon
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* Hospital Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Nearest Facility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{locationResult.nearest_facility.name}</h3>
                    <Badge className="bg-[#0077B6] text-white mb-2">
                      {locationResult.nearest_facility.facility_type}
                    </Badge>
                    <p className="text-sm text-gray-600">{locationResult.nearest_facility.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaRoad className="text-[#0077B6]" />
                        <p className="text-sm text-gray-600">Distance</p>
                      </div>
                      <p className="text-xl font-bold">{locationResult.route.distance_miles} mi</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaClock className="text-[#0077B6]" />
                        <p className="text-sm text-gray-600">ETA</p>
                      </div>
                      <p className="text-xl font-bold">{locationResult.route.eta_minutes} min</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getTrafficColor(locationResult.route.traffic_status)}`} />
                      <p className="text-sm">
                        Traffic: <span className="font-medium capitalize">{locationResult.route.traffic_status}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Emergency Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={locationResult.emergency_status.available ? 'bg-green-500' : 'bg-red-500'}>
                      {locationResult.emergency_status.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Wait Time:</span>
                    <span className="font-medium">{locationResult.emergency_status.wait_time_minutes} min</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Available Services:</p>
                    <ul className="space-y-1">
                      {locationResult.emergency_status.services.map((service, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#E63946] hover:bg-[#D62828] text-white py-6"
                  onClick={() => window.open(`tel:${locationResult.nearest_facility.phone}`)}
                >
                  <FaPhone className="mr-2" />
                  Call Hospital
                </Button>
                <Button
                  className="w-full bg-[#0077B6] hover:bg-[#005F8D] text-white py-6"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${locationResult.nearest_facility.latitude},${locationResult.nearest_facility.longitude}`
                    window.open(url, '_blank')
                  }}
                >
                  <FaDirections className="mr-2" />
                  Start Navigation
                </Button>
              </div>

              {/* Directions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Directions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {locationResult.route.directions.map((direction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 bg-[#0077B6] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{direction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {/* Back Button */}
        {!loading && (
          <div className="max-w-4xl mx-auto mt-6">
            <Link href="/results">
              <Button variant="outline" className="w-full">
                Back to Results
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
