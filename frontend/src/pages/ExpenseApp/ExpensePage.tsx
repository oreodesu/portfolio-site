import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BackLink from "../../components/BackLink";
import ConfirmModal from "../../components/ConfirmModal";
import LoadError from "../../components/LoadError";
import Modal from "../../components/Modal";
import ExpenseForm from "./ExpenseForm";
import LoginForm from "./LoginForm";
import { ExpenseInput } from "./api";
import { UnauthorizedError } from "./auth";
import { useAuth } from "./hooks/useAuth";
import { useExpenseData } from "./hooks/useExpenseData";
import { CategoryFormValues, Expense, ExpenseFormValues, categoryFormSchema } from "./schemas";
import { inputClass } from "./styles";

interface ModalState {
  title: string;
  message: string;
}

type ConfirmAction =
  | { type: "save"; id: number; input: ExpenseInput }
  | { type: "delete"; id: number }
  | { type: "deleteCategory"; id: number; name: string };

function toExpenseInput(values: ExpenseFormValues): ExpenseInput {
  return {
    category_id: Number(values.categoryId),
    amount: Number(values.amount),
    spent_on: values.spentOn,
    memo: values.memo || undefined,
  };
}

export default function ExpensePage() {
  const auth = useAuth();
  const data = useExpenseData(auth.user !== null);

  const [modal, setModal] = useState<ModalState | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "category">("date");

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "" },
  });

  // トークン切れは「エラー」ではなくログイン画面への復帰として扱う
  // auth オブジェクトは毎レンダリング作られるため、安定している logout だけを依存に置く
  useEffect(() => {
    if (data.loadError instanceof UnauthorizedError) auth.logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.loadError, auth.logout]);

  function handleFailure(error: unknown, message: string) {
    if (error instanceof UnauthorizedError) {
      auth.logout();
      return;
    }
    setModal({ title: "エラー", message });
  }

  async function handleAddCategory(values: CategoryFormValues) {
    try {
      await data.addCategory.mutateAsync(values.name);
      categoryForm.reset();
    } catch (error) {
      handleFailure(error, "カテゴリの追加に失敗しました。時間をおいて再度お試しください。");
    }
  }

  async function handleCreateExpense(values: ExpenseFormValues, resetForm: () => void) {
    try {
      await data.addExpense.mutateAsync(toExpenseInput(values));
      resetForm();
    } catch (error) {
      handleFailure(error, "支出の登録に失敗しました。時間をおいて再度お試しください。");
    }
  }

  async function handleConfirm() {
    const action = confirmAction;
    if (!action) return;
    setConfirmAction(null);

    try {
      if (action.type === "save") {
        await data.editExpense.mutateAsync({ id: action.id, input: action.input });
        setEditingId(null);
      } else if (action.type === "deleteCategory") {
        await data.removeCategory.mutateAsync(action.id);
      } else {
        await data.removeExpense.mutateAsync(action.id);
      }
    } catch (error) {
      // カテゴリ削除は「支出で使用中」など、サーバーが返す理由をそのまま伝える
      const fallback =
        action.type === "save"
          ? "支出の更新に失敗しました。時間をおいて再度お試しください。"
          : "削除に失敗しました。時間をおいて再度お試しください。";

      handleFailure(error, action.type === "deleteCategory" && error instanceof Error ? error.message : fallback);
    }
  }

  const header = (
    <>
      <BackLink />

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-blue-600">Works</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">家計簿アプリ</h1>
      <p className="mt-1 text-sm text-slate-500">Ruby on Rails (API mode) + MySQL / React</p>
    </>
  );

  // トークンの確認中は、ログイン画面が一瞬ちらつくのを避けるため見出しのみ表示する
  if (!auth.checked) {
    return <section>{header}</section>;
  }

  if (!auth.user) {
    return (
      <section>
        {header}
        <LoginForm onAuthenticated={auth.authenticate} />
      </section>
    );
  }

  const totalAmount = data.expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const visibleExpenses = data.expenses
    .filter((e) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return e.category.name.toLowerCase().includes(query) || (e.memo ?? "").toLowerCase().includes(query);
    })
    .sort((a, b) => (sortBy === "category" ? a.category.name.localeCompare(b.category.name, "ja") : 0));

  return (
    <section>
      {header}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">{auth.user.email}</span> でログイン中
        </p>
        <button
          onClick={auth.logout}
          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          ログアウト
        </button>
      </div>

      {data.loadError && !(data.loadError instanceof UnauthorizedError) && (
        <LoadError message="データの取得に失敗しました。" onRetry={data.refetch} />
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-700">カテゴリ</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1 pl-3 pr-1.5 text-xs font-medium text-blue-700"
            >
              {c.name}
              <button
                type="button"
                aria-label={`${c.name} を削除`}
                onClick={() => setConfirmAction({ type: "deleteCategory", id: c.id, name: c.name })}
                className="flex h-4 w-4 items-center justify-center rounded-full text-blue-400 transition hover:bg-blue-100 hover:text-red-600"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {data.categories.length === 0 && <span className="text-xs text-slate-400">まだカテゴリがありません</span>}
        </div>
        <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} noValidate className="mt-3">
          <div className="flex gap-2">
            <input
              {...categoryForm.register("name")}
              placeholder="新しいカテゴリ名 (例: 食費)"
              className={`${inputClass} flex-1`}
            />
            <button
              type="submit"
              disabled={data.addCategory.isPending}
              className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-60"
            >
              追加
            </button>
          </div>
          {categoryForm.formState.errors.name && (
            <p className="mt-1 text-xs text-red-600">{categoryForm.formState.errors.name.message}</p>
          )}
        </form>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <ExpenseForm
          categories={data.categories}
          submitting={data.addExpense.isPending}
          submitLabel="登録"
          onSubmit={handleCreateExpense}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">支出</h2>
        <div className="rounded-lg bg-slate-900 px-4 py-2 text-right">
          <p className="text-xs text-slate-300">合計金額</p>
          <p className="text-lg font-bold text-white">¥{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="カテゴリ・メモで検索"
          className={`${inputClass} min-w-[160px] flex-1`}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "category")}
          className={inputClass}
        >
          <option value="date">日付順</option>
          <option value="category">カテゴリ順</option>
        </select>
      </div>

      <ul className="mt-3 space-y-2">
        {visibleExpenses.map((expense) =>
          editingId === expense.id ? (
            <li key={expense.id} className="rounded-lg border border-blue-200 bg-blue-50/40 px-4 py-3">
              <ExpenseForm
                categories={data.categories}
                submitting={data.editExpense.isPending}
                submitLabel="保存"
                initialValues={toFormValues(expense)}
                onCancel={() => setEditingId(null)}
                onSubmit={(values) => {
                  setConfirmAction({ type: "save", id: expense.id, input: toExpenseInput(values) });
                }}
              />
            </li>
          ) : (
            <li
              key={expense.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {expense.category.name}
              </span>
              <span className="font-semibold text-slate-900">¥{Number(expense.amount).toLocaleString()}</span>
              <span className="text-slate-400">{expense.spent_on}</span>
              <span className="flex-1 truncate text-slate-500">{expense.memo}</span>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingId(expense.id)}
                  className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-green-700"
                >
                  編集
                </button>
                <button
                  onClick={() => setConfirmAction({ type: "delete", id: expense.id })}
                  className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </li>
          ),
        )}
        {visibleExpenses.length === 0 && !data.isLoading && (
          <li className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
            {data.expenses.length === 0 ? "まだ支出が登録されていません" : "条件に一致する支出がありません"}
          </li>
        )}
      </ul>

      <ConfirmModal
        open={confirmAction !== null}
        title={confirmTexts(confirmAction).title}
        message={confirmTexts(confirmAction).message}
        confirmLabel={confirmAction?.type === "save" ? "保存" : "削除"}
        danger={confirmAction?.type !== "save"}
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

function confirmTexts(action: ConfirmAction | null): { title: string; message: string } {
  switch (action?.type) {
    case "save":
      return { title: "支出を更新しますか?", message: "入力した内容で保存します。" };
    case "deleteCategory":
      return {
        title: "カテゴリを削除しますか?",
        message: `「${action.name}」を削除します。この操作は取り消せません。`,
      };
    default:
      return { title: "支出を削除しますか?", message: "この操作は取り消せません。" };
  }
}

function toFormValues(expense: Expense): ExpenseFormValues {
  return {
    categoryId: String(expense.category.id),
    amount: String(Number(expense.amount)),
    spentOn: expense.spent_on,
    memo: expense.memo ?? "",
  };
}
