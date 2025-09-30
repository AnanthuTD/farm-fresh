import { NextResponse, type NextRequest } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/lib/db-operations";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(settings || null);
  } catch (e) {
    console.error("Error getting store settings", e);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const ok = await updateStoreSettings(body);
    if (!ok) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    const settings = await getStoreSettings();
    return NextResponse.json(settings || null);
  } catch (e) {
    console.error("Error updating store settings", e);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
