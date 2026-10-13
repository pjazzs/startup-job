
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCards";
import JobFilters from "../components/JobFilters";
import { fetchJobs } from "../api/jobs";

const PAGE_SIZE = 9;

const initialFilters = {
  role: "",
  location: "",
  type: "",
};

const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]/g, "");

const matchesLocation = (jobLocation = "", selectedLocation = "") => {
  if (!selectedLocation) return true;

  const actual = jobLocation.toLowerCase();
  const selected = selectedLocation.toLowerCase();

  if (selected === "remote") return actual.includes("remote");

  const parts = selected
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.every((part) => actual.includes(part));
};

export default function Home({
  savedJobs = [],
  onToggleSave = () => {},
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;

    const loadJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchJobs({
          country: "NG",
          page: 1,
          perPage: 50,
        });

        if (!active) return;

        setJobs(result.jobs);
      } catch (err) {
        if (!active) return;

        setError(
          err.message ||
            "We couldn't load job listings. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJobs();

    return () => {
      active = false;
    };
  }, [reloadCount]);

  // Reset pagination whenever the search or filters change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filters.role, filters.location, filters.type]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.location,
        job.type,
        job.role,
        ...(job.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesRole =
        !filters.role ||
        normalize(job.role) === normalize(filters.role);

      const matchesSelectedLocation = matchesLocation(
        job.location,
        filters.location
      );

      const matchesType =
        !filters.type ||
        normalize(job.type) === normalize(filters.type);

      return (
        matchesSearch &&
        matchesRole &&
        matchesSelectedLocation &&
        matchesType
      );
    });
  }, [jobs, search, filters]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const clearFilters = () => {
    setSearch("");
    setFilters({ ...initialFilters });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Hero section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700">
                <Sparkles size={16} />
                Your next opportunity starts here
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Find a job that moves
                <span className="block text-indigo-600">
                  you forward.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover opportunities at ambitious companies and find a
                role where your skills can make a difference.
              </p>

              <div className="mt-9 text-left">
                <SearchBar search={search} setSearch={setSearch} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Search for React, designer, remote, or marketing.
              </p>
            </div>
          </div>
        </section>

        {/* Job listings */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Explore opportunities
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Find your next role
              </h2>

              <p className="mt-2 text-slate-500">
                Browse current listings from Remote OK.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {loading
                ? "Loading jobs..."
                : `${filteredJobs.length} jobs found`}
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <JobFilters
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              jobs={jobs}
            />

            <div className="min-w-0">
              {/* Loading state */}
              {loading && (
                <div
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  aria-label="Loading job listings"
                  aria-busy="true"
                >
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="h-12 w-12 rounded-xl bg-slate-200" />
                      <div className="mt-5 h-4 w-3/4 rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                      <div className="mt-6 h-3 w-full rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                      <div className="mt-6 h-9 rounded-lg bg-slate-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Couldn't load jobs
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => setReloadCount((count) => count + 1)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    <RefreshCw size={17} />
                    Try again
                  </button>
                </div>
              )}

              {/* Paginated job cards */}
              {!loading && !error && filteredJobs.length > 0 && (
                <>
                  <p className="mb-4 text-sm text-slate-500">
                    Showing {visibleJobs.length} of {filteredJobs.length} jobs
                  </p>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleJobs.map((job) => (
                      <div key={job.id} className="min-w-0">
                        <JobCard
                          job={job}
                          isSaved={savedJobs.some(
                            (savedId) =>
                              String(savedId) === String(job.id)
                          )}
                          onToggleSave={onToggleSave}
                        />

                        {job.sourceUrl && (
                          <p className="mt-2 px-1 text-xs text-slate-500">
                            <a
                              href={job.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-2 hover:text-indigo-600"
                            >
                              View original listing via Remote OK
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleCount((count) => count + PAGE_SIZE)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-50"
                      >
                        Load More Jobs
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}

                  {!hasMore && filteredJobs.length > PAGE_SIZE && (
                    <p className="mt-8 text-center text-sm text-slate-500">
                      You've reached the end of the current results.
                    </p>
                  )}
                </>
              )}

              {/* Empty state */}
              {!loading && !error && filteredJobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <h3 className="text-lg font-bold text-slate-900">
                    {jobs.length === 0
                      ? "No job listings available"
                      : "No jobs found"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {jobs.length === 0
                      ? "The API returned no current listings. Try again later."
                      : "Try another keyword or change your filters."}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (jobs.length === 0) {
                        setReloadCount((count) => count + 1);
                      } else {
                        clearFilters();
                      }
                    }}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {jobs.length === 0
                      ? "Reload jobs"
                      : "Clear search and filters"}
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} LaunchBoard. Designed by Pjazz.
          </p>

          <p className="mt-2">
            Job listings via{" "}
            <a
              href="https://remoteok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              Remote OK
            </a>
            . Check each original listing for application instructions.
          </p>
        </div>
      </footer>
    </div>
  );
}
