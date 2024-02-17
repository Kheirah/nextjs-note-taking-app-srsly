import { sql } from "@vercel/postgres";

export async function GET() {
  await createNotes();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const { rows } = await sql`SELECT * from NOTES`;

  return new Response(JSON.stringify(Object.values(rows)), {
    status: 200,
    headers: myHeaders,
  });
}

export async function POST(request) {
  await createNotes();
  const { content } = await request.json();

  await sql`INSERT INTO notes (content) VALUES (${content})`;

  return new Response("Successfully created a new note.", { status: 201 });
}

async function createNotes() {
  return await sql`
    CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
}
