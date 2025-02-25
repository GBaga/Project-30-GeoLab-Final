import { db } from "@vercel/postgres";

export default async function Handler(req, res) {
  const client = await db.connect();
  const { rows } = await client.query("SELECT * FROM weather");
  await client.end();

  res.status(200).json(rows);
}

console.log(rows, client);
