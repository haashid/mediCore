import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")
    const search = searchParams.get("search")

    // In real app, this would query MySQL database
    // Example query:
    // SELECT d.*, u.first_name, u.last_name, u.email, u.phone
    // FROM doctors d
    // JOIN users u ON d.user_id = u.id
    // WHERE d.specialization LIKE ? AND (u.first_name LIKE ? OR u.last_name LIKE ?)

    const mockDoctors = [
      {
        id: 1,
        user_id: 2,
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@medicenter.com",
        phone: "+1-555-0123",
        specialization: "Cardiology",
        license_number: "MD123456",
        experience_years: 15,
        consultation_fee: 150.0,
        location: "Downtown Medical Center",
        bio: "Experienced cardiologist specializing in heart disease prevention and treatment.",
        rating: 4.9,
        total_reviews: 127,
      },
      {
        id: 2,
        user_id: 3,
        first_name: "Michael",
        last_name: "Chen",
        email: "michael.chen@skincare.com",
        phone: "+1-555-0124",
        specialization: "Dermatology",
        license_number: "MD123457",
        experience_years: 12,
        consultation_fee: 120.0,
        location: "Skin Care Clinic",
        bio: "Board-certified dermatologist with expertise in skin conditions and cosmetic procedures.",
        rating: 4.8,
        total_reviews: 89,
      },
    ]

    let filteredDoctors = mockDoctors

    if (specialization) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.specialization.toLowerCase() === specialization.toLowerCase(),
      )
    }

    if (search) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.first_name.toLowerCase().includes(search.toLowerCase()) ||
          doctor.last_name.toLowerCase().includes(search.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({ doctors: filteredDoctors })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
