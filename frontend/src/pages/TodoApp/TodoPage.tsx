import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import BackLink from "../../components/BackLink";
import ConfirmModal from "../../components/ConfirmModal";
import LoadError from "../../components/LoadError";
import Modal from "../../components/Modal";
import { Todo, createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";

interface ModalState {
  title: string;
  message: string;
}

type ConfirmAction = { type: "save"; id: number; title: string } | { type: "delete"; id: number };

const todosKey = ["todo", "todos"];

export default function TodoPage() {
  const queryClient = useQueryClient();
  const todosQuery = useQuery({ queryKey: todosKey, queryFn: fetchTodos });

  const [title, setTitle] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: todosKey });

  const addTodo = useMutation({ mutationFn: createTodo, onSuccess: invalidateTodos });
  const editTodo = useMutation({
    mutationFn: ({ id, input }: { id: number; input: { title?: string; done?: boolean } }) =>
      updateTodo(id, input),
    onSuccess: invalidateTodos,
  });
  const removeTodo = useMutation({ mutationFn: deleteTodo, onSuccess: invalidateTodos });

  const todos = todosQuery.data ?? [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setModal({ title: "入力エラー", message: "やることを入力してください。" });
      return;
    }

    try {
      await addTodo.mutateAsync(title.trim());
      setTitle("");
    } catch {
      setModal({ title: "エラー", message: "TODOの作成に失敗しました。時間をおいて再度お試しください。" });
    }
  }

  async function handleToggleDone(todo: Todo) {
    try {
      await editTodo.mutateAsync({ id: todo.id, input: { done: !todo.done } });
    } catch {
      setModal({ title: "エラー", message: "TODOの更新に失敗しました。時間をおいて再度お試しください。" });
    }
  }

  function requestSave(id: number) {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setModal({ title: "入力エラー", message: "やることを入力してください。" });
      return;
    }
    setConfirmAction({ type: "save", id, title: trimmed });
  }

  async function handleConfirm() {
    const action = confirmAction;
    if (!action) return;
    setConfirmAction(null);

    try {
      if (action.type === "save") {
        await editTodo.mutateAsync({ id: action.id, input: { title: action.title } });
        setEditingId(null);
      } else {
        await removeTodo.mutateAsync(action.id);
      }
    } catch {
      setModal({
        title: "エラー",
        message:
          action.type === "save"
            ? "TODOの更新に失敗しました。時間をおいて再度お試しください。"
            : "TODOの削除に失敗しました。時間をおいて再度お試しください。",
      });
    }
  }

  return (
    <section>
      <BackLink />

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-blue-600">Works</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">TODOアプリ</h1>
      <p className="mt-1 text-sm text-slate-500">Go (Gin) + SQLite / React</p>

      {todosQuery.isError && <LoadError message="TODOの取得に失敗しました。" onRetry={todosQuery.refetch} />}

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={addTodo.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          追加
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            {editingId === todo.id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  autoFocus
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => requestSave(todo.id)}
                    className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    保存
                  </button>
                </div>
              </>
            ) : (
              <>
                <label
                  className={`flex items-center gap-3 text-sm ${
                    todo.done ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleDone(todo)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {todo.title}
                </label>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                    className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-green-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: "delete", id: todo.id })}
                    className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {todos.length === 0 && !todosQuery.isLoading && (
          <li className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
            まだTODOがありません
          </li>
        )}
      </ul>

      <ConfirmModal
        open={confirmAction !== null}
        title={confirmAction?.type === "delete" ? "TODOを削除しますか?" : "TODOを更新しますか?"}
        message={confirmAction?.type === "delete" ? "この操作は取り消せません。" : "入力した内容で保存します。"}
        confirmLabel={confirmAction?.type === "delete" ? "削除" : "保存"}
        danger={confirmAction?.type === "delete"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <Modal
        open={modal !== null}
        title={modal?.title ?? ""}
        message={modal?.message ?? ""}
        onClose={() => setModal(null)}
      />
    </section>
  );
}
