import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, userType, specialization, licenseNumber } = body

    // In real app, this would:
    // 1. Hash password using bcrypt
    // 2. Insert user into MySQL users table
    // 3. If doctor, insert additional info into doctors table
    // 4. Generate JWT token

    // Example queries:
    // INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES (?, ?, ?, ?, ?, ?)
    // If doctor: INSERT INTO doctors (user_id, specialization, license_number) VALUES (?, ?, ?)

    const mockUser = {
      id: Date.now(),
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      user_type: userType,
      token: "mock-jwt-token",
    }

    if (userType === "doctor") {
      // Additional doctor data would be saved
      mockUser.specialization = specialization
      mockUser.license_number = licenseNumber
    }

    return NextResponse.json({
      user: mockUser,
      message: "Registration successful",
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
