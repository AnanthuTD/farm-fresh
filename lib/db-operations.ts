import { getDatabase } from "./mongodb"
import type { Product, Analytics } from "./models/Product"

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase()
  if (!db) return []

  try {
    const products = await db.collection<Product>("products").find({ available: true }).toArray()
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  if (!db) return null

  try {
    const product = await db.collection<Product>("products").findOne({ id })
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function createProduct(
  product: Omit<Product, "_id" | "createdAt" | "updatedAt">,
): Promise<Product | null> {
  const db = await getDatabase()
  if (!db) return null

  try {
    const now = new Date()
    const newProduct = {
      ...product,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<Product>("products").insertOne(newProduct)
    return { ...newProduct, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating product:", error)
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  const db = await getDatabase()
  if (!db) return false

  try {
    const result = await db.collection<Product>("products").updateOne(
      { id },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating product:", error)
    return false
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  if (!db) return false

  try {
    const result = await db.collection<Product>("products").deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

export async function trackAnalytics(data: Omit<Analytics, "_id" | "timestamp">): Promise<void> {
  const db = await getDatabase()
  if (!db) {
    console.warn("Analytics tracking skipped - no database connection")
    return
  }

  try {
    await db.collection<Analytics>("analytics").insertOne({
      ...data,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Error tracking analytics:", error)
  }
}

export async function getAnalytics() {
  const db = await getDatabase()
  if (!db) {
    return {
      totalVisits: 0,
      pageVisits: [],
      productViews: [],
    }
  }

  try {
    // Get total visits
    const totalVisits = await db.collection<Analytics>("analytics").countDocuments({ type: "page_visit" })

    // Get visits per page
    const pageVisits = await db
      .collection<Analytics>("analytics")
      .aggregate([
        { $match: { type: "page_visit" } },
        { $group: { _id: "$page", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Get most viewed products
    const productViews = await db
      .collection<Analytics>("analytics")
      .aggregate([
        { $match: { type: "product_view" } },
        { $group: { _id: "$productId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    return {
      totalVisits,
      pageVisits,
      productViews,
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return {
      totalVisits: 0,
      pageVisits: [],
      productViews: [],
    }
  }
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const db = await getDatabase()
  if (!db) return false

  try {
    const admin = await db.collection("admin_users").findOne({ username, password })
    return !!admin
  } catch (error) {
    console.error("Error verifying admin:", error)
    return false
  }
}
