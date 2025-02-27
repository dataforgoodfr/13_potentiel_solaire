import { fetchCommunes } from "@/app/lib/data";
import { NextRequest } from "next/server";

/**
 * Get communes.
 * Get every communes if no codeDepartement is provided.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const codeDepartement = searchParams.get("codeDepartement");
  try {
    const data = await fetchCommunes(codeDepartement);
    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error while retrieving data:", error);
    return Response.json({ error }, { status: 500 });
  }
}
