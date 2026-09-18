export interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

const BASE_URL = "/api/todo";

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error("failed to fetch todos");
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("failed to create todo");
  return res.json();
}

export async function updateTodo(id: number, input: { title?: string; done?: boolean }): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("failed to update todo");
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("failed to delete todo");
}
