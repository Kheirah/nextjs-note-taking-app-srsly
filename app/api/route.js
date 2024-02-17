import { notes, nextId } from "./notes.js"; /* sadly, the state does not persist across routes */

export function GET() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return new Response(JSON.stringify(Object.values(notes)), {
    status: 200,
    headers: myHeaders,
  });
}

export async function POST(request) {
  const id = nextId.value++;
  const { content } = await request.json();
  notes[id] = { id, content };

  return new Response(JSON.stringify(notes[id]), { status: 201 });
}
