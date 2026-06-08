import { NextResponse } from "next/server";
import { listActiveCities } from "@/lib/cities/city-service";

export async function GET() {
  try {
    const cities = await listActiveCities();
    return NextResponse.json({
      success: true,
      data: { cities },
      error: null,
    });
  } catch (error) {
    console.error("Cities route failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Lista oraselor nu este disponibila momentan.",
      },
      { status: 500 },
    );
  }
}
