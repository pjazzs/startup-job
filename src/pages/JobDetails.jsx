
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Clock3,
  BriefcaseBusiness,
  Banknote,
  CheckCircle2,
  ExternalLink,
  Send,
  RefreshCw,
} from "lucide-react";

import { fetchJobById } from "../api/jobs";
import Navbar from "../components/Navbar";

export default function JobDetails({
  savedJobs = [],
  onToggleSave = () => {},
}) {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadJob = async () => {
      setLoading(true);
      setError("");
      setJob(null);

      try {
        const result = await fetchJobById(id);

        if (!cancelled) {
          setJob(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load this job. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const isSaved = savedJobs.some(
    (savedId) => String(savedId) === String(job?.id)
  );

  const getValidUrl = (value) => {
    if (!value || typeof value !== "string") return null;

    try {
      const url = new URL(value);

      return ["https:", "http:"].includes(url.protocol)
        ? url.href
        : null;
    } catch {
      return null;
    }
  };

  const applicationUrl = getValidUrl(job?.applyUrl);
  const sourceUrl = getValidUrl(job?.sourceUrl);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 py-20">
          <div className="animate-pulse space-y-5">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="h-8 w-2/3 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
              <div className="mt-8 h-24 rounded bg-slate-100" />
              <div className="mt-8 h-40 rounded bg-slate-100" />
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-slate-500">
            Loading job details...
          </p>
        </main>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Unable to load job
          </h1>

          <p className="mt-3 leading-6 text-slate-600">
            {error || "This listing could not be found in the current job feed."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw size={17} />
              Try again
            </button>

            <Link
              to="/"
              className="inline-flex rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse jobs
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to jobs
        </Link>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-9">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-700 sm:h-16 sm:w-16">
                  {job.logo || job.company?.charAt(0) || "J"}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-slate-500">
                    {job.company}
                  </p>

                  <h1 className="mt-1 break-words text-2xl font-extrabold text-slate-950 sm:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Posted {job.posted}
                  </p>

                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View original listing via Remote OK
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleSave(job.id)}
                aria-pressed={isSaved}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <Bookmark
                  size={18}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Saved" : "Save job"}
              </button>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 border-y border-slate-100 py-5 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <BriefcaseBusiness size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs text-slate-400">Employment type</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {job.type}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Banknote size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs text-slate-400">Salary</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {job.salary}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock3 size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs text-slate-400">Date posted</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {job.posted}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-indigo-50 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Interested in this role?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {applicationUrl
                      ? "Continue to the employer's application page to apply."
                      : "A direct application link is unavailable. Check the original listing for application instructions."}
                  </p>
                </div>

                {applicationUrl ? (
                  <a
                    href={applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Send size={18} />
                    Apply Now
                    <ExternalLink size={16} />
                  </a>
                ) : sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Listing
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-xl bg-slate-300 px-5 py-3 font-semibold text-slate-600"
                  >
                    <Send size={18} />
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            <div className="mt-9">
              <h2 className="text-xl font-bold text-slate-900">
                About this role
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {job.description || "No description was provided for this listing."}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                Skills and technologies
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {(job.tags || []).length > 0 ? (
                  job.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills or tags were provided.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-9 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Before you apply
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                This listing comes from Remote OK. Review the complete
                requirements and application instructions on the original
                listing before submitting your details.
              </p>

              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-indigo-600" />
                Confirm that your CV and relevant skills match the role.
              </p>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft size={17} />
              Explore more jobs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
