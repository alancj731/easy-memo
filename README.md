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

5. Start the servive:
   ```bash
   npm run start
   ```

6. Open [http://127.0.0.1:6789](http://127.0.0.1:6789) in your browser

## Adding Memos via Magic File

The fastest way to add memos is by writing to `data/magic_file.txt`. A cron job running in the background automatically imports entries from this file into the database.

### Format

Separate each memo with `===`. Use `---` to separate title from content.

```
title 1---
content 1 goes here
===
title 2---
content 2 goes here
===
meeting notes---
Discuss project timeline with the team
```

### How It Works

1. Edit `data/magic_file.txt` and add your memos in the format above
2. Save the file
3. The cron job (runs every 5 minutes by default) will:
   - Read the file
   - Insert each entry into the `memo` table
   - Clear the file after successful import

### Example

```bash
# Add some memos by appending to the magic file
echo "
shopping list
---
milk, eggs, bread, coffee
===
monday task
---
weekly meeting, code review
" >> data/magic_file.txt
```

Wait for the cron job to run (or run `npm run cron:local` manually), then refresh [http://127.0.0.1:6789](http://127.0.0.1:6789) to see your new memo.

## Using the Application

### Searching Records via Web UI

1. Visit [http://127.0.0.1:6789](http://127.0.0.1:6789)
2. Type in the search box to filter memos by title or content
3. Results update automatically as you type (400ms debounce)

### Deleting Records via Web UI

1. Find the memo you want to delete in the search results
2. Hover your mouse over it and click the trash icon that appears.
3. The record will be removed from the database

### API Endpoints (via localhost:6789)

- `GET http://127.0.0.1:6789/api/search?q=<query>` - Search memos
  ```bash
  # Example: Get all memos
  curl "http://127.0.0.1:6789/api/search?q="

  # Example: Search for memos containing "todo"
  curl "http://127.0.0.1:6789/api/search?q=todo"
  ```

- `DELETE http://127.0.0.1:6789/api/delete?id=<id>` - Delete a memo
  ```bash
  # Example: Delete a memo by ID
  curl -X DELETE "http://127.0.0.1:6789/api/delete?id=550e8400-e29b-41d4-a716-446655440000"
  ```

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
