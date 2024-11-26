import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

type Todo = {
  id: number;
  task: string;
  createdAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await getDb();

    switch (req.method) {
      case 'GET':
        const todos = await db.all('SELECT * FROM todos ORDER BY createdAt DESC') as Todo[];
        return res.status(200).json(todos);

      case 'POST':
        const { task } = req.body;
        if (!task?.trim()) {
          return res.status(400).json({ error: 'タスクを入力してください' });
        }
        const result = await db.run('INSERT INTO todos (task) VALUES (?)', task.trim());
        const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', result.lastID) as Todo;
        return res.status(201).json(newTodo);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 