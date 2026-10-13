
import { Bookmark, MapPin, Clock3, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job, isSaved, onToggleSave }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700">
            {job.logo}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {job.company}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {job.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          aria-label={isSaved ? "Remove saved job" : "Save job"}
          className={`rounded-lg border p-2 transition ${
            isSaved
              ? "border-indigo-200 bg-indigo-50 text-indigo-600"
              : "border-slate-200 text-slate-500 hover:text-indigo-600"
          }`}
        >
          <Bookmark size={19} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {job.type}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {job.role}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {job.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={16} />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 size={16} />
          {job.posted}
        </span>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <span className="text-sm font-bold text-slate-900">
          {job.salary}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
        >
          View details <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
