import { notes } from "../notes.js"; /* sadly, the state does not persist across routes */

export async function PUT(request, { params }) {
  const { content } = await request.json();
  const { id } = params;

  if (!notes[id]) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  notes[id] = { id, content };

  return new Response(JSON.stringify(notes[id]), { status: 201 });
}

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!notes[id]) {
    return new Response(JSON.stringify({ error: "note not found" }), {
      status: 404,
    });
  }

  delete notes[id];

  return new Response("successfully deleted", { status: 204 });
}
