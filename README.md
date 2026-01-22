# Easy Memo

A simple memo/note-taking application built with Next.js, PostgreSQL (Neon), and Tailwind CSS.

## Features

- **Search Functionality**: Search memos by title or content with real-time filtering
- **Quick Add via Magic File**: Add memos by writing to `data/magic_file.txt` - a cron job automatically imports them
- **Dark Mode UI**: Clean, modern interface with dark theme
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL (serverless)
- **Styling**: Tailwind CSS + Radix UI
- **Scheduling**: node-cron for automated imports

## Getting Started

### Prerequisites

- Node.js 22+
- Neon PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Neon database connection string:
   ```
   NEXT_PUBLIC_DATABASE_URL=your_neon_connection_string
   NEXT_PUBLIC_CRON_MINUTES=10  # Optional: cron job interval, default 5 minutes
   ```

4. Initialize the database:
   ```bash
   npm run init-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://127.0.0.1:6789](http://127.0.0.1:6789) in your browser

## Adding Memos

### Via Magic File

Write memos to `data/magic_file.txt` in the following format:
```
title 1
---
content 1
===
title 2
---
content 2
```

The cron job (runs every 10 minutes by default) will automatically import these into the database.


## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server with cron job |
| `npm run lint` | Run ESLint |
| `npm run init-db` | Initialize database table |
| `npm run cron:local` | Run cron job locally |

## API Endpoints

- `GET /api/search?q=<query>` - Search memos
- `DELETE /api/delete?id=<id>` - Delete a memo

## Project Structure

```
easy-memo/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── page.tsx      # Main search page
│   │   └── layout.tsx    # Root layout
│   ├── actions/          # Server actions
│   └── components/       # React components
├── scripts/
│   ├── init-db.ts        # Database initialization
│   └── cron-local.ts     # Cron job script
├── data/                 # Magic file storage
├── components/           # Shared UI components
└── lib/                  # Utility functions
```

## License

MIT
