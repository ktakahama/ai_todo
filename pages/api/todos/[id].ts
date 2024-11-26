import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    if (req.method === 'DELETE') {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      await sql`DELETE FROM todos WHERE id = ${Number(id)};`;
      return res.status(200).json({ message: 'Todo deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 