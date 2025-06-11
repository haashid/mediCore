"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, Search, Bell, Settings, LogOut, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Appointment {
  id: number
  doctor_first_name: string
  doctor_last_name: string
  specialization: string
  appointment_date: string
  appointment_time: string
  status: string
  reason: string
}

export default function PatientDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "patient") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchAppointments()
  }, [router])

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search doctors, specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-300">Manage your appointments and health records</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/book-appointment">
            <Card className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">Book Appointment</h3>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">My Appointments</h3>
              <p className="text-gray-300 text-sm">View & manage</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">Health Records</h3>
              <p className="text-gray-300 text-sm">Medical history</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">Prescriptions</h3>
              <p className="text-gray-300 text-sm">Current medications</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  My Appointments
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                    {appointments.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                              {appointment.doctor_first_name[0]}
                              {appointment.doctor_last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-white">
                              Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                            </h4>
                            <p className="text-gray-300 text-sm">{appointment.specialization}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-cyan-400 text-sm flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(appointment.appointment_date).toLocaleDateString()}
                              </span>
                              <span className="text-purple-400 text-sm flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.appointment_time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "secondary"}
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : appointment.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No appointments yet</p>
                    <Link href="/book-appointment">
                      <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                        Book Your First Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Info */}
          <div>
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white text-sm">Emergency Contact</h4>
                  <p className="text-cyan-400 text-lg font-bold">911</p>
                  <p className="text-gray-300 text-xs">24/7 Emergency Services</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white text-sm">Health Tips</h4>
                  <p className="text-gray-300 text-sm">
                    Stay hydrated and maintain regular exercise for better health.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                >
                  View Health Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
