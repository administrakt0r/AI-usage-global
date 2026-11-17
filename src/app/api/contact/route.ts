import { NextResponse } from "next/server";

import { validateAndSanitizeContactPayload } from "@/lib/contact";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const validation = validateAndSanitizeContactPayload(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. Thank you!",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
