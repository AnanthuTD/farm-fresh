"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Eye, Users, TrendingUp, Package } from "lucide-react"

interface AnalyticsData {
  totalVisits: number
  pageVisits: Array<{ _id: string; count: number }>
  productViews: Array<{ _id: string; count: number }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data available</div>
  }

  // Prepare data for charts
  const pageVisitData = analytics.pageVisits.map((item) => ({
    page: item._id || "Unknown",
    visits: item.count,
  }))

  const productViewData = analytics.productViews.slice(0, 5).map((item) => ({
    productId: item._id || "Unknown",
    views: item.count,
  }))

  const COLORS = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your website performance and user engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVisits}</div>
            <p className="text-xs text-muted-foreground">All-time page visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.productViews.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total product views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Pages</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageVisits.length}</div>
            <p className="text-xs text-muted-foreground">Pages with visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.productViews.length}</div>
            <p className="text-xs text-muted-foreground">Products viewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Visits Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Visits</CardTitle>
            <CardDescription>Visits per page breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageVisitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Product Views</CardTitle>
            <CardDescription>Most viewed products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productViewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ productId, percent }) => `${productId} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                >
                  {productViewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Visits Table */}
        <Card>
          <CardHeader>
            <CardTitle>Page Visit Details</CardTitle>
            <CardDescription>Detailed breakdown of page visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.pageVisits.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {page._id || "Unknown"}
                    </Badge>
                  </div>
                  <div className="font-semibold">{page.count} visits</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Views Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product View Details</CardTitle>
            <CardDescription>Most viewed products with counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.productViews.slice(0, 10).map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{product._id}</span>
                  </div>
                  <div className="font-semibold">{product.count} views</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
