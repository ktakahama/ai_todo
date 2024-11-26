import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id } = req.query;
    const db = await getDb();
    
    const result = await db.run('DELETE FROM todos WHERE id = ?', id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 