import { NextResponse, type NextRequest } from "next/server";
import { createCategory, getCategories } from "@/lib/db-operations";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.id || !body?.name) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }

    const category = await createCategory({
      id: String(body.id),
      name: String(body.name),
      description: body?.description ? String(body.description) : undefined,
      image: body?.image ? String(body.image) : undefined,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
