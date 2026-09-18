import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category, ExpenseFormValues, expenseFormSchema } from "./schemas";
import { inputClass } from "./styles";

interface ExpenseFormProps {
  categories: Category[];
  submitting: boolean;
  submitLabel: string;
  initialValues?: ExpenseFormValues;
  onSubmit: (values: ExpenseFormValues, resetForm: () => void) => void;
  onCancel?: () => void;
}

/** 支出の新規登録と編集で共通して使うフォーム */
export default function ExpenseForm({
  categories,
  submitting,
  submitLabel,
  initialValues,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialValues ?? {
      categoryId: "",
      amount: "",
      spentOn: new Date().toISOString().slice(0, 10),
      memo: "",
    },
  });

  // 登録後は金額とメモだけを空に戻し、カテゴリと日付は続けて入力しやすいよう残す
  function resetAfterCreate() {
    reset({ ...getValues(), amount: "", memo: "" });
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, resetAfterCreate))} noValidate>
      <div className="flex flex-wrap gap-2">
        <div>
          <select {...register("categoryId")} className={inputClass}>
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
        </div>

        <div>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="金額"
            {...register("amount")}
            className={`${inputClass} w-28`}
          />
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
        </div>

        <div>
          <input type="date" {...register("spentOn")} className={inputClass} />
          {errors.spentOn && <p className="mt-1 text-xs text-red-600">{errors.spentOn.message}</p>}
        </div>

        <div className="min-w-[160px] flex-1">
          <input placeholder="メモ (任意)" {...register("memo")} className={`${inputClass} w-full`} />
          {errors.memo && <p className="mt-1 text-xs text-red-600">{errors.memo.message}</p>}
        </div>

        <div className="flex shrink-0 gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white"
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
