require("dotenv").config()
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haashid@2005",
  database: "db",
})

// Test connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err)
    return
  }
  console.log("✅ Connected to MySQL database")
})

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "953c37a8b2f238e336e70e1387064acbfb6593abf7d46925ba6755c1570a33a4c8308774d51df392d5f63dc699dc30591759e9cc180f2ad0d4acde26cc79025d"

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, userType, specialization, licenseNumber } = req.body

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" })
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insert user
      const userQuery =
        "INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type) VALUES (?, ?, ?, ?, ?, ?)"
      db.query(userQuery, [firstName, lastName, email, phone, hashedPassword, userType], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create user" })
        }

        const userId = result.insertId

        // If doctor, insert additional info
        if (userType === "doctor") {
          const doctorQuery = "INSERT INTO doctors (user_id, specialization, license_number) VALUES (?, ?, ?)"
          db.query(doctorQuery, [userId, specialization, licenseNumber], (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to create doctor profile" })
            }
          })
        }

        // Generate JWT token
        const token = jwt.sign({ userId, email, userType }, JWT_SECRET, { expiresIn: "24h" })

        res.status(201).json({
          message: "User created successfully",
          token,
          user: {
            id: userId,
            firstName,
            lastName,
            email,
            userType,
          },
        })
      })
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body

    // Find user
    db.query("SELECT * FROM users WHERE email = ? AND user_type = ?", [email, userType], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" })
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const user = results[0]

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, userType: user.user_type }, JWT_SECRET, {
        expiresIn: "24h",
      })

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          userType: user.user_type,
        },
      })
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Doctor Routes
app.get("/api/doctors", (req, res) => {
  const { specialization, search } = req.query

  let query = `
    SELECT d.*, u.first_name, u.last_name, u.email, u.phone 
    FROM doctors d 
    JOIN users u ON d.user_id = u.id 
    WHERE 1=1
  `
  const params = []

  if (specialization && specialization !== "all") {
    query += " AND d.specialization = ?"
    params.push(specialization)
  }

  if (search) {
    query += " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR d.specialization LIKE ?)"
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    res.json({ doctors: results })
  })
})

app.get("/api/doctors/:id", (req, res) => {
  const doctorId = req.params.id

  const query = `
    SELECT d.*, u.first_name, u.last_name, u.email, u.phone 
    FROM doctors d 
    JOIN users u ON d.user_id = u.id 
    WHERE d.id = ?
  `

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Doctor not found" })
    }

    res.json({ doctor: results[0] })
  })
})

// Appointment Routes
app.get("/api/appointments", authenticateToken, (req, res) => {
  const { userId, userType } = req.user

  let query, params

  if (userType === "patient") {
    query = `
      SELECT a.*, d.specialization, u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `
    params = [userId]
  } else if (userType === "doctor") {
    query = `
      SELECT a.*, u.first_name as patient_first_name, u.last_name as patient_last_name, u.phone as patient_phone
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE d.user_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `
    params = [userId]
  } else {
    // Admin can see all appointments
    query = `
      SELECT a.*, 
             u1.first_name as patient_first_name, u1.last_name as patient_last_name,
             u2.first_name as doctor_first_name, u2.last_name as doctor_last_name,
             d.specialization
      FROM appointments a
      JOIN users u1 ON a.patient_id = u1.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u2 ON d.user_id = u2.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `
    params = []
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    res.json({ appointments: results })
  })
})

app.post("/api/appointments", authenticateToken, (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, reason } = req.body
  const patientId = req.user.userId

  // Check if slot is available
  const checkQuery =
    'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "cancelled"'

  db.query(checkQuery, [doctorId, appointmentDate, appointmentTime], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Time slot not available" })
    }

    // Book appointment
    const insertQuery =
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, "pending")'

    db.query(insertQuery, [patientId, doctorId, appointmentDate, appointmentTime, reason], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to book appointment" })
      }

      res.status(201).json({
        message: "Appointment booked successfully",
        appointmentId: result.insertId,
      })
    })
  })
})

app.put("/api/appointments/:id", authenticateToken, (req, res) => {
  const appointmentId = req.params.id
  const { status } = req.body
  const { userId, userType } = req.user

  // Verify user can update this appointment
  let verifyQuery
  let verifyParams

  if (userType === "doctor") {
    verifyQuery = `
      SELECT a.* FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      WHERE a.id = ? AND d.user_id = ?
    `
    verifyParams = [appointmentId, userId]
  } else if (userType === "patient") {
    verifyQuery = "SELECT * FROM appointments WHERE id = ? AND patient_id = ?"
    verifyParams = [appointmentId, userId]
  } else {
    // Admin can update any appointment
    verifyQuery = "SELECT * FROM appointments WHERE id = ?"
    verifyParams = [appointmentId]
  }

  db.query(verifyQuery, verifyParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Appointment not found or unauthorized" })
    }

    // Update appointment
    const updateQuery = "UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?"

    db.query(updateQuery, [status, appointmentId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update appointment" })
      }

      res.json({ message: `Appointment ${status} successfully` })
    })
  })
})

// Admin Routes
app.get("/api/admin/stats", authenticateToken, (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }

  const queries = {
    totalUsers: "SELECT COUNT(*) as count FROM users",
    totalDoctors: "SELECT COUNT(*) as count FROM doctors",
    totalAppointments: "SELECT COUNT(*) as count FROM appointments",
    pendingAppointments: 'SELECT COUNT(*) as count FROM appointments WHERE status = "pending"',
  }

  const stats = {}
  let completed = 0

  Object.keys(queries).forEach((key) => {
    db.query(queries[key], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" })
      }

      stats[key] = results[0].count
      completed++

      if (completed === Object.keys(queries).length) {
        res.json({ stats })
      }
    })
  })
})

app.get("/api/admin/users", authenticateToken, (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }

  const query =
    "SELECT id, first_name, last_name, email, phone, user_type, created_at FROM users ORDER BY created_at DESC"

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    res.json({ users: results })
  })
})

// User profile routes
app.get("/api/profile", authenticateToken, (req, res) => {
  const userId = req.user.userId

  const query = "SELECT id, first_name, last_name, email, phone, user_type FROM users WHERE id = ?"

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = results[0]

    // If doctor, get additional info
    if (user.user_type === "doctor") {
      const doctorQuery = "SELECT * FROM doctors WHERE user_id = ?"
      db.query(doctorQuery, [userId], (err, doctorResults) => {
        if (err) {
          return res.status(500).json({ error: "Database error" })
        }

        res.json({
          user: {
            ...user,
            doctorInfo: doctorResults[0] || null,
          },
        })
      })
    } else {
      res.json({ user })
    }
  })
})

app.put("/api/profile", authenticateToken, (req, res) => {
  const userId = req.user.userId
  const { firstName, lastName, phone, specialization, experience, fee, location, bio } = req.body

  // Update user basic info
  const userQuery = "UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?"

  db.query(userQuery, [firstName, lastName, phone, userId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update profile" })
    }

    // If doctor, update doctor info
    if (req.user.userType === "doctor") {
      const doctorQuery = `
        UPDATE doctors 
        SET specialization = ?, experience_years = ?, consultation_fee = ?, location = ?, bio = ?
        WHERE user_id = ?
      `

      db.query(doctorQuery, [specialization, experience, fee, location, bio, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update doctor profile" })
        }

        res.json({ message: "Profile updated successfully" })
      })
    } else {
      res.json({ message: "Profile updated successfully" })
    }
  })
})

// Get all users (for testing)
app.get("/users", (req, res) => {
  db.query("SELECT id, first_name, last_name, email, user_type FROM users", (err, results) => {
    if (err) return res.json({ error: err })
    res.json(results)
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
