'use client'

/**
 * Admin Dashboard Page
 * Analytics and monitoring for healthcare administrators
 */

import Link from 'next/link'
import { FaHeartbeat, FaExclamationTriangle, FaUsers, FaChartLine, FaVideo, FaFlag } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Mock admin data
const stats = {
  totalAssessments: 1247,
  highRiskCount: 89,
  activeConsultations: 12,
  redFlagFrequency: 7.1,
}

const highRiskCases = [
  {
    id: 'P-001',
    patientId: '****1234',
    urgency: 'High',
    primaryComplaint: 'Severe chest pain',
    timestamp: new Date('2026-02-06T09:30:00'),
    status: 'In Progress',
  },
  {
    id: 'P-002',
    patientId: '****5678',
    urgency: 'High',
    primaryComplaint: 'Difficulty breathing',
    timestamp: new Date('2026-02-06T08:15:00'),
    status: 'Resolved',
  },
  {
    id: 'P-003',
    patientId: '****9012',
    urgency: 'High',
    primaryComplaint: 'Severe headache with vision changes',
    timestamp: new Date('2026-02-06T07:45:00'),
    status: 'Video Consult',
  },
  {
    id: 'P-004',
    patientId: '****3456',
    urgency: 'High',
    primaryComplaint: 'Abdominal pain with fever',
    timestamp: new Date('2026-02-06T06:20:00'),
    status: 'Emergency Route',
  },
  {
    id: 'P-005',
    patientId: '****7890',
    urgency: 'Moderate',
    primaryComplaint: 'Persistent cough',
    timestamp: new Date('2026-02-06T05:55:00'),
    status: 'Pending',
  },
]

const dailyAssessments = [
  { date: 'Feb 1', count: 42 },
  { date: 'Feb 2', count: 38 },
  { date: 'Feb 3', count: 51 },
  { date: 'Feb 4', count: 45 },
  { date: 'Feb 5', count: 48 },
  { date: 'Feb 6', count: 33 },
]

const urgencyDistribution = {
  high: 89,
  moderate: 412,
  low: 746,
}

export default function AdminPage() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Resolved':
        return 'bg-green-100 text-green-800'
      case 'Video Consult':
        return 'bg-purple-100 text-purple-800'
      case 'Emergency Route':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
              <Link href="/admin" className="text-[#0077B6] font-medium border-b-2 border-[#0077B6] pb-1">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Monitor system performance and high-risk cases</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
              <FaUsers className="text-[#0077B6] text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAssessments.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High-Risk Cases</CardTitle>
              <FaExclamationTriangle className="text-[#E63946] text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E63946]">{stats.highRiskCount}</div>
              <p className="text-xs text-gray-600 mt-1">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Consultations</CardTitle>
              <FaVideo className="text-[#48CAE4] text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#48CAE4]">{stats.activeConsultations}</div>
              <p className="text-xs text-gray-600 mt-1">Live video sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Red Flag Rate</CardTitle>
              <FaFlag className="text-[#E63946] text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.redFlagFrequency}%</div>
              <p className="text-xs text-gray-600 mt-1">Of all assessments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Assessments Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartLine />
                Daily Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {dailyAssessments.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0077B6] rounded-t-lg relative group cursor-pointer hover:bg-[#005F8D] transition-colors">
                      <div
                        className="w-full bg-[#0077B6] rounded-t-lg"
                        style={{ height: `${(day.count / 60) * 200}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} assessments
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{day.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Urgency Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#E63946] rounded" />
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <span className="text-sm font-bold">{urgencyDistribution.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#E63946] h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.high /
                            (urgencyDistribution.high + urgencyDistribution.moderate + urgencyDistribution.low)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span className="text-sm font-medium">Moderate</span>
                    </div>
                    <span className="text-sm font-bold">{urgencyDistribution.moderate}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.moderate /
                            (urgencyDistribution.high + urgencyDistribution.moderate + urgencyDistribution.low)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm font-medium">Low</span>
                    </div>
                    <span className="text-sm font-bold">{urgencyDistribution.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.low /
                            (urgencyDistribution.high + urgencyDistribution.moderate + urgencyDistribution.low)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Cases:</span>
                    <span className="font-bold">
                      {(urgencyDistribution.high + urgencyDistribution.moderate + urgencyDistribution.low).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High-Risk Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaExclamationTriangle className="text-[#E63946]" />
              High-Risk Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Primary Complaint</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskCases.map((case_) => (
                  <TableRow key={case_.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{case_.id}</TableCell>
                    <TableCell className="font-mono text-sm">{case_.patientId}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(case_.urgency)}>{case_.urgency}</Badge>
                    </TableCell>
                    <TableCell>{case_.primaryComplaint}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {case_.timestamp.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(case_.status)}>
                        {case_.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
