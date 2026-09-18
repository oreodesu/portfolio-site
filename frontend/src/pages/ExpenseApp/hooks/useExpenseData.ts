import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ExpenseInput,
  createCategory,
  createExpense,
  deleteCategory,
  deleteExpense,
  fetchCategories,
  fetchExpenses,
  updateExpense,
} from "../api";

const categoriesKey = ["expense", "categories"];
const expensesKey = ["expense", "expenses"];

/**
 * 家計簿のデータ取得・更新をまとめて扱う。
 * 更新系は成功時に一覧を再取得させることで、画面の状態をサーバーの状態に一致させる
 * (登録した支出が日付順の正しい位置に並ぶのも、この再取得によるもの)。
 */
export function useExpenseData(enabled: boolean) {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: categoriesKey,
    queryFn: fetchCategories,
    enabled,
  });

  const expensesQuery = useQuery({
    queryKey: expensesKey,
    queryFn: fetchExpenses,
    enabled,
  });

  const invalidateExpenses = () => queryClient.invalidateQueries({ queryKey: expensesKey });

  const invalidateCategories = () => queryClient.invalidateQueries({ queryKey: categoriesKey });

  const addCategory = useMutation({
    mutationFn: createCategory,
    onSuccess: invalidateCategories,
  });

  const removeCategory = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: invalidateCategories,
  });

  const addExpense = useMutation({
    mutationFn: (input: ExpenseInput) => createExpense(input),
    onSuccess: invalidateExpenses,
  });

  const editExpense = useMutation({
    mutationFn: ({ id, input }: { id: number; input: ExpenseInput }) => updateExpense(id, input),
    onSuccess: invalidateExpenses,
  });

  const removeExpense = useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: invalidateExpenses,
  });

  return {
    categories: categoriesQuery.data ?? [],
    expenses: expensesQuery.data ?? [],
    isLoading: categoriesQuery.isLoading || expensesQuery.isLoading,
    loadError: categoriesQuery.error ?? expensesQuery.error ?? null,
    refetch: () => {
      categoriesQuery.refetch();
      expensesQuery.refetch();
    },
    addCategory,
    removeCategory,
    addExpense,
    editExpense,
    removeExpense,
  };
}
