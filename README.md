# LaunchBoard — Startup Job Board

LaunchBoard is a responsive job discovery platform that helps users explore remote job opportunities, search for relevant positions, filter listings, view job details, and save interesting jobs for later.

The application retrieves live job listings from the [Remote OK API](https://remoteok.com), providing access to real job opportunities instead of relying entirely on hardcoded demo data.

## Features

- **Live Job Listings:** Fetches job opportunities from the Remote OK API.
- **Job Search:** Search jobs by title, company, description, location, role, job type, and tags.
- **Dynamic Filters:** Filter listings by role, location, and job type using options derived from the available jobs.
- **Job Details:** View job descriptions, company information, tags, and application links.
- **Save Jobs:** Bookmark interesting opportunities and access saved jobs later.
- **Local Storage:** Preserves bookmarked job IDs in the browser between visits.
- **Load More:** Display additional job listings in batches.
- **Loading and Error States:** Provides feedback while jobs are loading or when a request fails.
- **Responsive Design:** Adapts to mobile, tablet, and desktop screens.
- **External Application Links:** Directs users to the original job listing or application page.

## Tech Stack

- **React** — Component-based user interface
- **Vite** — Development server and build tooling
- **JavaScript** — Application logic
- **Tailwind CSS** — Responsive styling
- **React Router** — Client-side navigation
- **Lucide React** — Icons
- **Remote OK API** — Live job listing data
- **Browser Local Storage** — Saved-job persistence

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm, which comes with Node.js
- Git (optional, for version control)

### Installation

1. Clone the repository or download the project files.

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate into the project folder.

   ```bash
   cd startup-job-board
   ```

3. Install dependencies.

   ```bash
   npm install
   ```

4. Start the development server.

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### Build for Production

To create an optimized production build, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## API Integration

LaunchBoard uses the Remote OK public job feed:

`https://remoteok.com/api`

The API service is organized in `src/api/jobs.js`. It retrieves job listings and normalizes the returned data for use throughout the application.

The service supports retrieving the job feed and finding a job by its ID.

**Important:** The Load More feature currently reveals additional jobs from the listings already fetched by the application. It is client-side display pagination, not a separate request for each page from the API.

Job availability and listing details depend on the external API. A job may no longer be available after it has been removed from the feed.

## Project Structure

```text
startup-job-board/
├── public/
├── src/
│   ├── api/
│   │   └── jobs.js
│   ├── components/
│   │   ├── JobCards.jsx
│   │   ├── JobFilters.jsx
│   │   └── ...
│   ├── hooks/
│   │   └── useSavedJobs.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── JobDetails.jsx
│   │   ├── SavedJobs.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── index.html
├── package.json
└── README.md
```

*The structure above illustrates the main files; your actual component and configuration files may differ.*

## Saved Jobs

Bookmarked job IDs are stored in the browser's Local Storage using the key:

`launchboard_saved_jobs`

This means bookmarks persist in the same browser, but they are not synchronized between devices or different browsers. Saved jobs may also become unavailable if the corresponding listing disappears from the API feed.

## Future Improvements

Potential enhancements include:

- Advanced filtering and job sorting
- Dedicated company and job category pages
- More robust saved-job persistence
- Job alerts and email notifications
- Improved pagination and API request handling
- Automated tests
- Accessibility and performance improvements
- Deployment and a custom domain

## Attribution

Job listings are provided by [Remote OK](https://remoteok.com). LaunchBoard is an independent project and is not affiliated with or endorsed by Remote OK.

## Author

**Created by Pjazz**

Built as a web development project focused on API integration, reusable React components, client-side state management, and responsive user interfaces.
