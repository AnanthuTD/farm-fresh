import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (uri && uri.includes("mongodb")) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise

export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) {
    console.warn("MongoDB URI not configured. Database operations will be skipped.")
    return null
  }

  try {
    const client = await clientPromise
    return client.db("meatshop")
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    return null
  }
}
