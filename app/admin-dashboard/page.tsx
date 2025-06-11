"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, UserCheck, Calendar, Clock, Bell, Settings, LogOut, Activity, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  user_type: string
  created_at: string
}

interface Stats {
  totalUsers: number
  totalDoctors: number
  totalAppointments: number
  pendingAppointments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.userType !== "admin") {
      router.push("/login")
      return
    }

    fetchStats()
    fetchUsers()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
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
                MediCore Admin
              </span>
            </Link>

            <div className="flex items-center space-x-4">
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
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage users, doctors, and system overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
              <p className="text-blue-100">Total Users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0">
            <CardContent className="p-6 text-center">
              <UserCheck className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{stats.totalDoctors}</h3>
              <p className="text-green-100">Total Doctors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 border-0">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{stats.totalAppointments}</h3>
              <p className="text-purple-100">Total Appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 border-0">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{stats.pendingAppointments}</h3>
              <p className="text-orange-100">Pending Appointments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Recent Users
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                    {users.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                            {user.first_name[0]}
                            {user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="text-gray-300 text-sm">{user.email}</p>
                          <p className="text-gray-400 text-xs">{user.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={user.user_type === "admin" ? "default" : "secondary"}
                          className={
                            user.user_type === "admin"
                              ? "bg-red-500/20 text-red-400"
                              : user.user_type === "doctor"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                          }
                        >
                          {user.user_type}
                        </Badge>
                        <p className="text-gray-400 text-xs mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                >
                  View All Users
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve Doctors
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Appointments
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  System Reports
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Database</span>
                  <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Server</span>
                  <Badge className="bg-green-500/20 text-green-400">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Email Service</span>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Storage</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">85% Used</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
