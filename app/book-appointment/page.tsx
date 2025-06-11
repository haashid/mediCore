"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Star, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Doctor {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  specialization: string
  experience_years: number
  consultation_fee: number
  location: string
  bio: string
  rating: number
}

export default function BookAppointmentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentReason, setAppointmentReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const router = useRouter()

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    fetchDoctors()
  }, [router])

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/doctors?specialization=${selectedSpecialization}&search=${searchQuery}`,
      )

      if (response.ok) {
        const data = await response.json()
        setDoctors(data.doctors)
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [selectedSpecialization, searchQuery])

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason) {
      alert("Please fill in all fields")
      return
    }

    setBooking(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          reason: appointmentReason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Appointment booked successfully!")
        router.push("/patient-dashboard")
      } else {
        alert(data.error || "Failed to book appointment")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setBooking(false)
    }
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
            <div className="flex items-center space-x-4">
              <Link href="/patient-dashboard">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  MediCore
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Book an Appointment</h1>
          <p className="text-gray-300">Find and book with the best doctors near you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search doctors, specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
            </div>
            <Select onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Dermatology">Dermatology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                <SelectItem value="General Medicine">General Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Loading doctors...</div>
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg">
                          {doctor.first_name[0]}
                          {doctor.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <p className="text-cyan-400 mb-2">{doctor.specialization}</p>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 font-medium">{doctor.rating || 4.8}</span>
                          </div>
                          <span className="text-gray-300 text-sm">{doctor.experience_years} years experience</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {doctor.location || "Medical Center"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${doctor.consultation_fee || 150}</div>
                        <div className="text-gray-300 text-sm">Consultation fee</div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                          >
                            Book Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border border-white/20 text-white max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Book Appointment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                                  {selectedDoctor?.first_name[0]}
                                  {selectedDoctor?.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">
                                  Dr. {selectedDoctor?.first_name} {selectedDoctor?.last_name}
                                </h4>
                                <p className="text-cyan-400 text-sm">{selectedDoctor?.specialization}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-white mb-2 block">Select Date</Label>
                                <Input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="bg-white/5 border-white/20 text-white focus:border-cyan-400"
                                />
                              </div>

                              <div>
                                <Label className="text-white mb-2 block">Select Time</Label>
                                <div className="grid grid-cols-3 gap-2">
                                  {timeSlots.map((slot) => (
                                    <Button
                                      key={slot}
                                      variant={selectedTime === slot ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setSelectedTime(slot)}
                                      className={
                                        selectedTime === slot
                                          ? "bg-cyan-500 text-white"
                                          : "border-white/20 text-white hover:bg-white/10"
                                      }
                                    >
                                      {slot}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="reason" className="text-white mb-2 block">
                                  Reason for Visit
                                </Label>
                                <Textarea
                                  id="reason"
                                  placeholder="Describe your symptoms or reason for consultation..."
                                  value={appointmentReason}
                                  onChange={(e) => setAppointmentReason(e.target.value)}
                                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                                  rows={3}
                                />
                              </div>

                              <div className="bg-white/5 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">Consultation Fee:</span>
                                  <span className="text-white font-semibold">
                                    ${selectedDoctor?.consultation_fee || 150}
                                  </span>
                                </div>
                              </div>

                              <Button
                                onClick={handleBookAppointment}
                                disabled={booking || !selectedDate || !selectedTime || !appointmentReason}
                                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                              >
                                {booking ? "Booking..." : "Confirm Booking"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No doctors found</h3>
              <p className="text-gray-300">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
