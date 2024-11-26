import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  task: string;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask }),
    });

    if (response.ok) {
      setNewTask('');
      fetchTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white/80 backdrop-blur-lg shadow-2xl sm:rounded-3xl sm:p-20 border border-white/20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200/50">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ToDoリスト
                </h1>
                
                <form onSubmit={addTodo} className="flex gap-2 mb-8">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="新しいタスクを入力"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    追加
                  </button>
                </form>

                <ul className="space-y-4">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/50 transition-all duration-200"
                    >
                      <span className="text-gray-800">{todo.task}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        削除
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 