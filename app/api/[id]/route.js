import { sql } from "@vercel/postgres";

export async function GET(request, { params }) {
  const { id } = params;

  const { rows } = await sql`SELECT * FROM notes WHERE id=${id}`;

  if (!rows.length) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(rows[0]), { status: 200 });
}

export async function PUT(request, { params }) {
  const { content } = await request.json();
  const { id } = params;

  const { rowCount } =
    await sql`UPDATE notes SET content = ${content} WHERE id=${id}`;

  if (!rowCount) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response("Successfully edited the note.", { status: 201 });
}

export async function DELETE(request, { params }) {
  const { id } = params;

  const { rowCount } = await sql`DELETE FROM notes WHERE id=${id}`;

  if (!rowCount) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  return new Response("Successfully deleted the note.", { status: 200 });
}
