
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await sql`
      SELECT id, title, description
      FROM projects
      ORDER BY id DESC
    `;

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET projects failed:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      !title.trim() ||
      !description.trim() ||
      title.trim().length > 120 ||
      description.trim().length > 2000
    ) {
      return NextResponse.json(
        { error: "Valid title and description are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO projects (title, description)
      VALUES (${title.trim()}, ${description.trim()})
      RETURNING id, title, description
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST project failed:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
