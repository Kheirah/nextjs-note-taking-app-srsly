import { sql } from "@vercel/postgres";

export async function GET(request, { params }) {
  const { user, id } = params;

  const { rows } =
    await sql`SELECT notes.content FROM users LEFT JOIN notes ON users.id = notes."userId" WHERE users.name=${user} AND notes.id=${id}`;

  if (!rows.length) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(rows[0]), { status: 200 });
}

export async function PUT(request, { params }) {
  const { content } = await request.json();
  const { user, id: notesId } = params;

  /* first check to see if we can find the user */
  const {
    rows: [{ id }],
  } = await sql`SELECT id FROM users WHERE users.name=${user}`;

  /* then use that user's id to update the requested note */
  const { rowCount } =
    await sql`UPDATE notes SET content = ${content} WHERE notes."userId"=${id} AND notes.id=${notesId}`;

  if (!rowCount) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response("Successfully edited the note.", { status: 201 });
}

export async function DELETE(request, { params }) {
  const { user, id: notesId } = params;

  /* first check to see if we can find the user */
  const {
    rows: [{ id }],
  } = await sql`SELECT id FROM users WHERE users.name=${user}`;

  /* then use that user's id to delete the requested note */
  const { rowCount } =
    await sql`DELETE FROM notes WHERE notes."userId"=${id} AND notes.id=${notesId}`;

  if (!rowCount) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response("Successfully deleted the note.", { status: 200 });
}
