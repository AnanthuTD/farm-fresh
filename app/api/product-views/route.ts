import { NextResponse } from "next/server";
import { getProductViewsDetailed } from "@/lib/db-operations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sort = (searchParams.get("sort") as "views" | "name") || "views";
  try {
    const data = await getProductViewsDetailed({ category, search, sort });
    return NextResponse.json(data);
  } catch (e) {
    console.error("product-views GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
