import { NextResponse } from "next/server";
import { incrementProductInterest, listProductInterest } from "@/lib/db-operations";

export async function GET() {
  try {
    const data = await listProductInterest();
    return NextResponse.json(data);
  } catch (e) {
    console.error("product-interest GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = body?.productId as string | undefined;
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
    await incrementProductInterest(productId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("product-interest POST error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
