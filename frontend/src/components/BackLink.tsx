import { Link } from "react-router-dom";

export default function BackLink() {
  return (
    <Link to="/" className="text-sm text-slate-500 transition hover:text-slate-900">
      &larr; Portfolio トップへ戻る
    </Link>
  );
}
