"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - in real app, this would come from MySQL database
const pendingAppointments = [
  {
    id: 1,
    patient: "John Smith",
    date: "2024-01-15",
    time: "10:00 AM",
    reason: "Regular checkup",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    patient: "Emily Johnson",
    date: "2024-01-15",
    time: "2:30 PM",
    reason: "Follow-up consultation",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    patient: "Michael Brown",
    date: "2024-01-16",
    time: "9:00 AM",
    reason: "Skin condition",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const todaySchedule = [
  {
    id: 1,
    patient: "Sarah Wilson",
    time: "9:00 AM",
    reason: "Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "David Lee",
    time: "10:30 AM",
    reason: "Follow-up",
    status: "confirmed",
  },
  {
    id: 3,
    patient: "Lisa Chen",
    time: "2:00 PM",
    reason: "Check-up",
    status: "confirmed",
  },
]

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState(pendingAppointments)

  const handleAppointmentAction = (id: number, action: "approve" | "reject") => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
    // In real app, this would update the MySQL database
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                MediCore
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, Dr. Sarah Johnson!</h1>
          <p className="text-gray-300">Cardiology Specialist • Downtown Medical Center</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">127</h3>
              <p className="text-cyan-100">Total Patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 border-0">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">8</h3>
              <p className="text-purple-100">Today's Appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">3</h3>
              <p className="text-green-100">Pending Approvals</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 border-0">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">4.9</h3>
              <p className="text-orange-100">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Appointments */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Pending Appointments
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                    {appointments.length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                            {appointment.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{appointment.patient}</h4>
                          <p className="text-gray-300 text-sm">{appointment.reason}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-cyan-400 text-sm flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {appointment.date}
                            </span>
                            <span className="text-purple-400 text-sm flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAppointmentAction(appointment.id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAppointmentAction(appointment.id, "reject")}
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-300">No pending appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div>
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{appointment.patient}</h4>
                        <p className="text-gray-300 text-xs">{appointment.reason}</p>
                        <span className="text-cyan-400 text-xs flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{appointment.status}</Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                >
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                  Update Availability
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                >
                  View Patient Records
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                >
                  Manage Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
