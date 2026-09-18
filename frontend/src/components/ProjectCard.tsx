import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  stack: string;
  description: string;
  href: string;
  external?: boolean;
  recommended?: boolean;
}

export default function ProjectCard({
  title,
  stack,
  description,
  href,
  external,
  recommended = false,
}: ProjectCardProps) {
  const content = (
    <>
      {recommended && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-amber-950 shadow-sm">
          おすすめ
        </span>
      )}
      <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {stack}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
        触ってみる
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </>
  );

  const className = [
    "group relative block rounded-2xl bg-white p-6 transition duration-200",
    "hover:-translate-y-1 hover:shadow-lg",
    recommended
      ? "border-2 border-amber-300 shadow-md hover:border-amber-400"
      : "border border-slate-200 shadow-sm",
  ].join(" ");

  if (external) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {content}
    </Link>
  );
}
