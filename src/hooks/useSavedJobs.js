
import { useEffect, useState } from "react";

const STORAGE_KEY = "launchboard_saved_jobs";

export default function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) return [];

      // Support both numeric demo IDs and string API IDs.
      return [
        ...new Set(
          parsed
            .filter(
              (id) =>
                (typeof id === "string" && id.trim() !== "") ||
                (typeof id === "number" && Number.isFinite(id))
            )
            .map(String)
        ),
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs));
    } catch (error) {
      console.error("Unable to save bookmarked jobs:", error);
    }
  }, [savedJobs]);

  const toggleSavedJob = (jobId) => {
    if (jobId === null || jobId === undefined || String(jobId).trim() === "") {
      return;
    }

    const normalizedId = String(jobId);

    setSavedJobs((previous) =>
      previous.includes(normalizedId)
        ? previous.filter((id) => id !== normalizedId)
        : [...previous, normalizedId]
    );
  };

  return { savedJobs, toggleSavedJob };
}
