import { sql } from "@vercel/postgres";

export async function GET(request, { params }) {
  await createTables();

  const { user } = params;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const { rows } =
    await sql`SELECT notes.id, notes.content FROM users LEFT JOIN notes ON users.id = notes."userId" WHERE users.name=${user}`;

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: myHeaders,
  });
}

export async function POST(request, { params }) {
  await createTables();

  const { content } = await request.json();
  const { user } = params;

  /* create a new user if that user doesn't already exist */
  await sql`INSERT INTO users (name) VALUES (${user}) ON CONFLICT DO NOTHING`;

  /* get the id of the newly created user */
  const {
    rows: [{ id }],
  } = await sql`SELECT id FROM users WHERE users.name=${user}`;

  /* create a new note for that user */
  await sql`INSERT INTO notes (content, "userId") VALUES (${content}, ${id})`;

  return new Response(`Successfully created a new note for ${user}.`, {
    status: 201,
  });
}

async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
  await sql`
      CREATE TABLE IF NOT EXISTS notes (
          id SERIAL PRIMARY KEY,
          content VARCHAR(255) NOT NULL,
          "userId" integer REFERENCES users (id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
      `;
}
