
import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
    >
      <Search className="ml-3 shrink-0 text-slate-400" size={22} />

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Job title, company, or keyword..."
        aria-label="Search jobs"
        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />

      <button
        type="submit"
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
