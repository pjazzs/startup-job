
const API_URL = "https://remoteok.com/api";

const cleanHtml = (html = "") =>
  String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const formatSalary = (min, max) => {
  const format = (value) =>
    `$${Number(value).toLocaleString("en-US")}`;

  if (min > 0 && max > 0) {
    return `${format(min)} - ${format(max)} USD`;
  }

  if (min > 0) return `From ${format(min)} USD`;
  if (max > 0) return `Up to ${format(max)} USD`;

  return "Salary not disclosed";
};

const formatPostedDate = (date) => {
  if (!date) return "Date not specified";

  const postedDate = new Date(date);

  if (Number.isNaN(postedDate.getTime())) {
    return "Date not specified";
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - postedDate.getTime()) / 86400000)
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

  return postedDate.toLocaleDateString();
};

const inferRole = (tags = []) => {
  const value = tags.join(" ").toLowerCase();

  if (/design|figma|ux|ui/.test(value)) return "Design";
  if (/marketing|seo|content|social media/.test(value)) return "Marketing";
  if (/product manager|product management/.test(value)) return "Product";
  if (/sales|business development/.test(value)) return "Sales";
  if (/finance|accounting/.test(value)) return "Finance";
  if (/hr|recruit/.test(value)) return "Human Resources";

  return "Engineering";
};

const normalizeJob = (job) => {
  const tags = Array.isArray(job.tags)
    ? job.tags.filter((tag) => typeof tag === "string")
    : [];

  const salaryMin = Number(job.salary_min) || 0;
  const salaryMax = Number(job.salary_max) || 0;

  return {
    // Keep IDs as strings because API IDs may not be numeric.
    id: String(job.id ?? job.slug),
    title: job.position || "Untitled position",
    company: job.company || "Company not specified",
    logo: (job.company || "J").charAt(0).toUpperCase(),
    location: job.location || "Remote",
    type: job.job_type || "Remote",
    role: inferRole(tags),
    salary: formatSalary(salaryMin, salaryMax),
    posted: formatPostedDate(job.date),
    description: cleanHtml(job.description || ""),
    tags,
    applyUrl: job.apply_url || job.url || "",
    sourceUrl: job.url || "",
    source: "Remote OK",
  };
};

export async function fetchJobs() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Remote OK could not load jobs (HTTP ${response.status}).`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Remote OK returned an unexpected response.");
  }

  // Remote OK's first array item is API metadata, not a job.
  const jobs = data
    .filter(
      (item) =>
        item &&
        item.id != null &&
        item.position &&
        item.company
    )
    .map(normalizeJob);

  return {
    jobs,
    pagination: {
      page: 1,
      perPage: jobs.length,
      total: jobs.length,
      totalPages: 1,
    },
    attribution: {
      source: "Remote OK",
      url: "https://remoteok.com",
    },
  };
}

export async function fetchJobById(id) {
  const result = await fetchJobs();

  const job = result.jobs.find(
    (item) => String(item.id) === String(id)
  );

  if (!job) {
    throw new Error(
      "This job is no longer in the current Remote OK feed."
    );
  }

  return job;
}
