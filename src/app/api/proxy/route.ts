// app/api/proxy/route.ts
import { NextResponse } from "next/server";

const generateCodesFromFilter = (filter: string) => {
  const codes: string[] = [];
  const regex = new RegExp(filter.replace(/x/g, '\\d'));

  // Generate codes from 100 to 599 based on the filter
  for (let code = 100; code <= 599; code++) {
    if (regex.test(code.toString())) {
      codes.push(code.toString());
    }
  }

  return codes;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");

  if (!filter) {
    return NextResponse.json({ error: "No filter provided" }, { status: 400 });
  }

  try {
    const responseCodes = generateCodesFromFilter(filter);
    const imageUrls = [];

    // Fetch images for each generated response code
    for (const code of responseCodes) {
      const response = await fetch(`https://http.dog/${code}.jpg`);
      if (response.ok) {
        imageUrls.push(`https://http.dog/${code}.jpg`);
      }
    }

    return NextResponse.json({ images: imageUrls });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
