import { useState, useEffect } from 'react';
import Head from 'next/head';

type Todo = {
  id: number;
  task: string;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask }),
      });

      if (response.ok) {
        const todo = await response.json();
        setTodos(prev => [todo, ...prev]);
        setNewTask('');
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Todo App - Next.js</title>
        <meta name="description" content="Simple Todo application" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
              Todo List
              <span className="block text-lg font-normal mt-2 text-purple-200">
                タスクを管理しましょう
              </span>
            </h1>
          
            <form onSubmit={handleSubmit} className="mb-12">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="新しいタスクを入力..."
                  className="flex-1 px-6 py-4 rounded-xl border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? '追加中...' : '追加'}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg flex justify-between items-center hover:bg-white/95 transition-all duration-200 group transform hover:-translate-y-1"
                >
                  <span className="text-gray-800 font-medium flex-1 mr-4">
                    {todo.task}
                    <span className="block text-xs text-gray-500 mt-1">
                      {new Date(todo.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-5 py-2.5 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-red-600 hover:to-pink-600 transform hover:scale-105 active:scale-95"
                  >
                    削除
                  </button>
                </div>
              ))}
              {todos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/80 bg-white/10 backdrop-blur-sm rounded-xl p-8">
                    <p className="text-xl mb-2">タスクがありません</p>
                    <p className="text-sm text-purple-200">
                      新しいタスクを追加してください
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 