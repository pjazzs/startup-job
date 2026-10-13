
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import useSavedJobs from "./hooks/useSavedJobs";

function AppContent() {
  const { savedJobs, toggleSavedJob } = useSavedJobs();

  const sharedProps = {
    savedJobs,
    onToggleSave: toggleSavedJob,
  };

  return (
    <Routes>
      <Route path="/" element={<Home {...sharedProps} />} />

      <Route
        path="/jobs/:id"
        element={<JobDetails {...sharedProps} />}
      />

      <Route
        path="/saved"
        element={<SavedJobs {...sharedProps} />}
      />

      <Route
        path="*"
        element={
          <main className="px-5 py-20 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Page not found
            </h1>
            <a
              href="/"
              className="mt-5 inline-block font-semibold text-indigo-600"
            >
              Return home
            </a>
          </main>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
