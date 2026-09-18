import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unexpected error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-semibold text-slate-900">予期しないエラーが発生しました</p>
          <p className="text-sm text-slate-600">お手数ですが、ページを再読み込みしてください。</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
