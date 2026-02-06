'use client'

/**
 * Symptom History Page
 * Timeline view of past assessments with filters and trend charts
 */

import Link from 'next/link'
import { FaHeartbeat, FaChevronDown, FaChevronUp, FaCalendar, FaFilter } from 'react-icons/fa'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface HistoryEntry {
  id: string
  date: Date
  urgencyLevel: 'High' | 'Moderate' | 'Low'
  riskScore: number
  primaryComplaint: string
  symptoms: string[]
  specialist: string
}

// Mock history data
const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    date: new Date('2026-02-05'),
    urgencyLevel: 'High',
    riskScore: 100,
    primaryComplaint: 'Severe chest pain',
    symptoms: ['Chest pain', 'Sweating', 'Shortness of breath'],
    specialist: 'Cardiology',
  },
  {
    id: '2',
    date: new Date('2026-01-28'),
    urgencyLevel: 'Moderate',
    riskScore: 50,
    primaryComplaint: 'Persistent headache',
    symptoms: ['Headache', 'Nausea', 'Light sensitivity'],
    specialist: 'Neurology',
  },
  {
    id: '3',
    date: new Date('2026-01-15'),
    urgencyLevel: 'Low',
    riskScore: 25,
    primaryComplaint: 'Mild sore throat',
    symptoms: ['Sore throat', 'Mild fever', 'Fatigue'],
    specialist: 'General Practice',
  },
  {
    id: '4',
    date: new Date('2025-12-20'),
    urgencyLevel: 'Moderate',
    riskScore: 60,
    primaryComplaint: 'Ankle sprain',
    symptoms: ['Ankle pain', 'Swelling', 'Difficulty walking'],
    specialist: 'Orthopedics',
  },
]

export default function HistoryPage() {
  const [filterUrgency, setFilterUrgency] = useState<string>('all')
  const [filterDateRange, setFilterDateRange] = useState<string>('all')
  const [expandedEntries, setExpandedEntries] = useState<string[]>([])

  const toggleEntry = (id: string) => {
    setExpandedEntries((prev) =>
      prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
    )
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-[#E63946] text-white'
      case 'Moderate':
        return 'bg-yellow-500 text-white'
      case 'Low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-[#E63946]'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredHistory = mockHistory.filter((entry) => {
    if (filterUrgency !== 'all' && entry.urgencyLevel.toLowerCase() !== filterUrgency) {
      return false
    }
    // Additional date range filtering could be implemented here
    return true
  })

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
              <Link href="/history" className="text-[#0077B6] font-medium border-b-2 border-[#0077B6] pb-1">
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Assessment History</h2>
            <p className="text-gray-600">Review your past symptom assessments and track your health trends</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaFilter />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Urgency Level</label>
                  <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="All urgency levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart Placeholder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Risk Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Risk Score Evolution Chart</p>
                  <p className="text-sm text-gray-500">Chart.js Integration - Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Assessment Timeline</h3>

            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">No assessments found matching your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

                {filteredHistory.map((entry, index) => (
                  <Collapsible
                    key={entry.id}
                    open={expandedEntries.includes(entry.id)}
                    onOpenChange={() => toggleEntry(entry.id)}
                  >
                    <div className="relative pb-8">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                          entry.urgencyLevel === 'High'
                            ? 'bg-[#E63946]'
                            : entry.urgencyLevel === 'Moderate'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      />

                      {/* Entry Card */}
                      <div className="ml-20">
                        <Card className="hover:shadow-lg transition-shadow">
                          <CollapsibleTrigger className="w-full">
                            <CardHeader className="cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className={getUrgencyColor(entry.urgencyLevel)}>
                                      {entry.urgencyLevel}
                                    </Badge>
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                      <FaCalendar className="text-xs" />
                                      {entry.date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-bold">{entry.primaryComplaint}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Risk Score:{' '}
                                    <span className={`font-bold ${getRiskScoreColor(entry.riskScore)}`}>
                                      {entry.riskScore}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  {expandedEntries.includes(entry.id) ? (
                                    <FaChevronUp className="text-gray-400" />
                                  ) : (
                                    <FaChevronDown className="text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="border-t pt-4">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold mb-2">Symptoms:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {entry.symptoms.map((symptom, idx) => (
                                      <Badge key={idx} variant="outline">
                                        {symptom}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-1">Recommended Specialist:</h5>
                                  <p className="text-gray-700">{entry.specialist}</p>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </div>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>

          {/* New Assessment Button */}
          <div className="mt-8">
            <Link href="/assessment">
              <Button className="w-full bg-[#0077B6] hover:bg-[#005F8D] text-white py-6 text-lg">
                Start New Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
