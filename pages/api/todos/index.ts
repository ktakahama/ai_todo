import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // テーブルが存在しない場合は作成
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM todos ORDER BY created_at DESC;`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { task } = req.body;
      if (!task) {
        return res.status(400).json({ error: 'Task is required' });
      }

      const { rows } = await sql`
        INSERT INTO todos (task)
        VALUES (${task})
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 