import { type NextRequest, NextResponse } from "next/server"
import { trackAnalytics, getAnalytics } from "@/lib/db-operations"

export async function POST(request: NextRequest) {
  try {
    const analyticsData = await request.json()
    await trackAnalytics(analyticsData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ success: true })
  }
}

export async function GET() {
  try {
    const analytics = await getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({
      totalVisits: 0,
      pageVisits: [],
      productViews: [],
    })
  }
}
