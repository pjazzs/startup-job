
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight, RefreshCw } from "lucide-react";

import { fetchJobs } from "../api/jobs";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCards";

export default function SavedJobs({
  savedJobs = [],
  onToggleSave = () => {},
}) {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchJobs();
      setAllJobs(result.jobs);
    } catch (err) {
      setError(err.message || "Unable to load saved job listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const savedIds = savedJobs.map(String);

  const savedListings = allJobs.filter((job) =>
    savedIds.includes(String(job.id))
  );

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:py-16">
        <div className="mb-9">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Bookmark size={17} />
            YOUR COLLECTION
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Saved jobs
          </h1>

          <p className="mt-3 text-slate-600">
            Keep track of opportunities you want to explore.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {loading
              ? "Checking your saved listings..."
              : `${savedListings.length} ${
                  savedListings.length === 1 ? "job" : "jobs"
                } available from your saved collection`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-6 h-20 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <section className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Couldn't load saved listings
            </h2>

            <p className="mt-2 text-sm text-slate-600">{error}</p>

            <button
              type="button"
              onClick={loadJobs}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </section>
        ) : savedListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedListings.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>

            {savedListings.length < savedIds.length && (
              <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Some saved jobs aren't in the current Remote OK feed. They
                may have expired or been removed. Your saved IDs remain in
                localStorage, but those listings can't be displayed from the
                current feed.
              </p>
            )}
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Bookmark size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {savedIds.length > 0
                ? "Your saved listings aren't available"
                : "No saved jobs yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {savedIds.length > 0
                ? "Your saved jobs may have expired or disappeared from the current feed. Browse the latest listings to find new opportunities."
                : "When you find an interesting opportunity, bookmark it to keep it here for later."}
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore jobs <ArrowRight size={18} />
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
