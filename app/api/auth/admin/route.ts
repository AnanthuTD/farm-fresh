import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/db-operations"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const isValid = await verifyAdmin(username, password)

    if (isValid) {
      // In a real app, you'd create a JWT token here
      return NextResponse.json({ success: true, token: "admin-token" })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error verifying admin:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
