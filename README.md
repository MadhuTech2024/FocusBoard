# FocusBoard

FocusBoard is a responsive, frontend-only task dashboard built with React and Vite. It helps organize tasks by status, priority, and due date, with dashboard summaries, a calendar, and browser-local preferences.

## Project overview

FocusBoard keeps task planning in one interface: manage a task list from the dashboard, review due dates in the calendar, and adjust appearance and task defaults in Settings. Tasks, preferences, and profile details are stored in the browser; the application does not use a backend.

## Project objectives

- Provide a clear dashboard for reviewing and updating work.
- Make task status, priority, and due dates easy to manage.
- Offer calendar and dashboard views over the same task collection.
- Preserve user preferences and profile details between visits in the same browser.
- Keep the implementation responsive and usable on desktop and mobile screens.

## Features

- **Dashboard:** Overview of tasks, Focus Notes carousel, and task list.
- **Task management:** Create, edit, delete, and change the status of tasks.
- **Search and filters:** Search task text and filter by status and priority.
- **Dynamic statistics:** Task totals, in-progress and completed counts, and completion percentage are calculated from the current task collection.
- **Focus Notes carousel:** Three focus messages with slide controls and progress indicators.
- **Calendar:** Navigate months, select dates, and view or edit tasks scheduled for a date.
- **Settings:** Manage appearance, task defaults, profile details, and task data.
- **Light and dark themes:** Select a theme that is saved in browser storage.
- **User profile:** Save a name, optional email and bio, and an optional avatar image locally.
- **JSON task export and import:** Download a task backup or validate and replace tasks from a FocusBoard backup after confirmation.
- **Browser storage:** Tasks, settings, and profile details persist in `localStorage` for the current browser origin.

## Technology stack

- React 19 with JavaScript and JSX
- Vite 8
- Custom CSS and CSS variables
- React hooks
- `localStorage` for browser-local persistence
- `lucide-react` for icons
- Oxlint for linting

## Screenshots

No screenshots are included yet. Add genuine captures before replacing these placeholders; do not use mock or illustrative images as application screenshots.

- **Dashboard:** _Screenshot placeholder — capture the dashboard._
- **Calendar:** _Screenshot placeholder — capture the calendar._
- **Settings:** _Screenshot placeholder — capture Settings, including the theme and profile controls._

## Project structure

```text
FocusBoard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   └── CalendarPage.jsx
│   │   ├── common/
│   │   │   ├── Brand.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── ProfileAvatar.jsx
│   │   ├── dashboard/
│   │   │   ├── FocusCarousel.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── settings/
│   │   │   ├── ProfileSettings.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── tasks/
│   │       ├── TaskCard.jsx
│   │       ├── TaskFilters.jsx
│   │       ├── TaskList.jsx
│   │       └── TaskModal.jsx
│   ├── data/
│   │   └── initialTasks.js
│   ├── hooks/
│   │   ├── usePreferences.js
│   │   ├── useProfile.js
│   │   └── useTasks.js
│   ├── styles/
│   │   ├── brand.css
│   │   ├── calendar.css
│   │   ├── carousel.css
│   │   ├── global.css
│   │   ├── header.css
│   │   ├── layout.css
│   │   ├── navigation.css
│   │   ├── profile.css
│   │   ├── responsive.css
│   │   ├── settings.css
│   │   ├── sidebar.css
│   │   ├── statistics.css
│   │   ├── task-cards.css
│   │   ├── task-dialog.css
│   │   ├── task-filters.css
│   │   ├── themes.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── profileHelpers.js
│   │   ├── taskBackup.js
│   │   └── taskHelpers.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── AI_USAGE.md
├── index.html
├── package-lock.json
├── package.json
├── README-vite-backup.md
├── README.md
└── vite.config.js
```

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (the supported engine range for the installed Vite 8 version).
- npm.

## Installation

In Windows PowerShell, clone the repository and install its dependencies:

```powershell
git clone https://github.com/MadhuTech2024/FocusBoard.git
Set-Location -Path ".\FocusBoard"
npm install
```

If the repository is already on your computer, open PowerShell in its project directory instead of cloning it again.

## Running locally

From the project directory, start the Vite development server:

```powershell
npm run dev
```

Open the local address printed by Vite in your browser. The development server is for local development; it does not publish the app.

## Build and lint

Run these commands from the project directory:

```powershell
npm run build
npm run lint
```

The production build is written to `dist/`. To serve that build locally after building:

```powershell
npm run preview
```

## Application usage

1. Open the dashboard to review the sample tasks and current statistics.
2. Select **New task** (or the mobile add button) to create a task. Use the task menu to edit or delete a task; the status control cycles through available statuses.
3. Use the search field and status and priority filters to narrow the task list.
4. Open **Calendar** to move between months, select a date, and view or edit tasks with due dates.
5. Open **Settings** to choose a theme, set defaults for newly created tasks, and update the local profile.
6. Use **Export tasks** to download a JSON backup. **Import tasks** validates a FocusBoard backup and asks for confirmation before replacing the current task collection. **Reset tasks** restores the original sample tasks after confirmation.

## Data storage and privacy

FocusBoard is a frontend-only application. It has no backend, authentication, or database, and it does not synchronize data between devices. Tasks (`focusboard-tasks`), settings (`focusboard-settings`), and profile details (`focusboard-profile`) are stored in the browser's `localStorage` for the current origin. Browser storage can be cleared by the user or browser, so export a backup if you need a separate copy of your tasks.

Profile avatars are stored in the browser as image data and are limited by the application to 512 KB. Do not enter sensitive information that should not be stored in this browser.

## Known limitations

- Data is local to the current browser and origin; it is not backed up or synchronized automatically.
- Import replaces the current task collection after confirmation; it does not merge tasks.
- The repository does not currently define a dedicated automated test script.
- Screenshots and a hosted live demo have not yet been added.

## Future enhancements

These are possible future improvements and are not currently implemented:

- Add focused automated tests for task, calendar, settings, and import behavior.
- Capture actual application screenshots and publish a live demo.
- Consider optional cross-device synchronization only with a real backend and an explicitly designed security model.
- Consider additional task backup or merge workflows.

## GitHub repository

[https://github.com/MadhuTech2024/FocusBoard](https://github.com/MadhuTech2024/FocusBoard)

## Live demo

_Placeholder — the project has no known deployed demo URL yet. Add the public deployment URL here after deployment._

## AI assistance

See [AI_USAGE.md](./AI_USAGE.md) for a summary of AI assistance and developer responsibilities.
