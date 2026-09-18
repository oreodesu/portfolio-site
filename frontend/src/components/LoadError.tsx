interface LoadErrorProps {
  message: string;
  onRetry: () => void;
}

export default function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span>{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-md border border-amber-300 px-3 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
      >
        再読み込み
      </button>
    </div>
  );
}
