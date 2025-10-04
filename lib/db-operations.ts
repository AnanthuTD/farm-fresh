import { getDatabase } from "./mongodb";
import type { Product, Analytics } from "./models/Product";
import type { Category } from "./models/Category";
import type { StoreSettings } from "./models/StoreSettings";

export async function getProducts(category?: string): Promise<Product[]> {
  const db = await getDatabase();
  if (!db) return [];

  try {
    const query: any = { available: true };
    if (category) {
      query.category = category;
    }
    
    const products = await db
      .collection<Product>("products")
      .find(query)
      .toArray();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
// Product Interest (users want to buy unavailable items)
export async function incrementProductInterest(
  productId: string
): Promise<void> {
  const db = await getDatabase();
  if (!db) return;
  try {
    await db
      .collection("product_interest")
      .updateOne({ productId }, { $inc: { count: 1 } }, { upsert: true });
  } catch (error) {
    console.error("Error incrementing product interest:", error);
  }
}

export async function listProductInterest(): Promise<
  Array<{ _id: string; count: number }>
> {
  const db = await getDatabase();
  if (!db) return [];
  try {
    const docs = await db
      .collection<{ productId: string; count: number }>("product_interest")
      .aggregate([
        { $group: { _id: "$productId", count: { $sum: "$count" } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    return docs as any;
  } catch (error) {
    console.error("Error listing product interest:", error);
    return [];
  }
}

// Detailed product views with optional filters
export async function getProductViewsDetailed(params: {
  category?: string;
  search?: string;
  sort?: "views" | "name";
}): Promise<
  Array<{ id: string; name: string; category: string; views: number }>
> {
  const db = await getDatabase();
  if (!db) return [];
  const { category, search, sort = "views" } = params || {};
  try {
    const pipeline: any[] = [
      { $match: { type: "product_view" } },
      { $group: { _id: "$productId", views: { $sum: 1 } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          name: { $ifNull: ["$product.name", "Unknown"] },
          category: { $ifNull: ["$product.category", "unknown"] },
          views: 1,
        },
      },
    ];
    if (category && category !== "all") {
      pipeline.push({ $match: { category } });
    }
    if (search) {
      pipeline.push({ $match: { name: { $regex: search, $options: "i" } } });
    }
    pipeline.push({ $sort: sort === "name" ? { name: 1 } : { views: -1 } });

    const results = await db
      .collection<Analytics>("analytics")
      .aggregate(pipeline)
      .toArray();
    return results as any;
  } catch (error) {
    console.error("Error fetching detailed product views:", error);
    return [];
  }
}

// Store Settings
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const doc = await db
      .collection<StoreSettings>("store_settings")
      .findOne({});
    return doc;
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return null;
  }
}

export async function updateStoreSettings(
  settings: Omit<StoreSettings, "_id" | "updatedAt">
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const result = await db
      .collection<StoreSettings>("store_settings")
      .updateOne(
        {},
        {
          $set: {
            ...settings,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    return result.modifiedCount > 0 || !!result.upsertedId;
  } catch (error) {
    console.error("Error updating store settings:", error);
    return false;
  }
}
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDatabase();
  if (!db) return [];

  try {
    const products = await db
      .collection<Product>("products")
      .find({})
      .toArray();
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  if (!db) return [];

  try {
    const categories = await db
      .collection<Category>("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(
  category: Omit<Category, "_id" | "createdAt" | "updatedAt">
): Promise<Category | null> {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const now = new Date();
    const newCategory: Category = {
      ...category,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<Category>("categories")
      .insertOne(newCategory);
    return { ...newCategory, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const result = await db
      .collection<Category>("categories")
      .updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const result = await db
      .collection<Category>("categories")
      .deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const product = await db.collection<Product>("products").findOne({ id });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createProduct(
  product: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product | null> {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const now = new Date();
    const newProduct = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<Product>("products")
      .insertOne(newProduct);
    return { ...newProduct, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const result = await db.collection<Product>("products").updateOne(
      { id },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const result = await db.collection<Product>("products").updateOne(
      { id },
      {
        $set: {
          available: false,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

export async function trackAnalytics(
  data: Omit<Analytics, "_id" | "timestamp">
): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    console.warn("Analytics tracking skipped - no database connection");
    return;
  }

  try {
    await db.collection<Analytics>("analytics").insertOne({
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error tracking analytics:", error);
  }
}

export async function getAnalytics() {
  const db = await getDatabase();
  if (!db) {
    return {
      totalVisits: 0,
      pageVisits: [],
      productViews: [],
    };
  }

  try {
    // Get total visits
    const totalVisits = await db
      .collection<Analytics>("analytics")
      .countDocuments({ type: "page_visit" });

    // Get visits per page
    const pageVisits = await db
      .collection<Analytics>("analytics")
      .aggregate([
        { $match: { type: "page_visit" } },
        { $group: { _id: "$page", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Get most viewed products
    const productViews = await db
      .collection<Analytics>("analytics")
      .aggregate([
        { $match: { type: "product_view" } },
        { $group: { _id: "$productId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    return {
      totalVisits,
      pageVisits,
      productViews,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      totalVisits: 0,
      pageVisits: [],
      productViews: [],
    };
  }
}

export async function verifyAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;

  try {
    const admin = await db
      .collection("admin_users")
      .findOne({ username, password });
    return !!admin;
  } catch (error) {
    console.error("Error verifying admin:", error);
    return false;
  }
}
