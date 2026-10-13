
import { SlidersHorizontal } from "lucide-react";

const filterConfig = [
  { key: "role", label: "Role", allLabel: "All roles" },
  { key: "location", label: "Location", allLabel: "All locations" },
  { key: "type", label: "Job type", allLabel: "All types" },
];

export default function JobFilters({
  filters,
  setFilters,
  onClear,
  jobs = [],
}) {
  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const getOptions = (key) => {
    const values = jobs
      .map((job) => job[key])
      .filter(
        (value) => typeof value === "string" && value.trim() !== ""
      );

    // Keep the currently selected option available.
    if (filters[key]) {
      values.push(filters[key]);
    }

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  };

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal size={19} />
          Filters
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Clear all
        </button>
      </div>

      {filterConfig.map(({ key, label, allLabel }) => {
        const options = getOptions(key);

        return (
          <div key={key} className="mt-6">
            <label
              htmlFor={`filter-${key}`}
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {label}
            </label>

            <select
              id={`filter-${key}`}
              value={filters[key]}
              onChange={(event) => updateFilter(key, event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">{allLabel}</option>

              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {options.length === 0 && (
              <p className="mt-2 text-xs text-slate-400">
                No options available yet.
              </p>
            )}
          </div>
        );
      })}
    </aside>
  );
}
