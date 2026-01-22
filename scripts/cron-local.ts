import { neon } from "@neondatabase/serverless";
import cron from "node-cron";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const cronMinutes = process.env.NEXT_PUBLIC_CRON_MINUTES || "5";

console.log("[Cron] Local cron scheduler started");

cron.schedule(`*/${cronMinutes} * * * *`, async () => {
  console.log("[Cron] Job triggered at:", new Date().toISOString());

  try {
    const data = fs.readFileSync("data/magic_file.txt", "utf-8");

    if (!data.trim()) {
      console.log("[Cron] No data found in magic_file.txt");
      return;
    }

    const items = getTitleAndContent(data);

    await insertToDatabase(items);

    cleanMagigFile();

  } catch (error) {
    console.error("[Cron] Job failed with error:", error);
  }
});

async function insertToDatabase(items: { title: string; content: string }[]) {
  if (items.length === 0) {
    console.log("[Cron] No items to insert");
    return;
  }

  const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
  if (!databaseUrl) {
    console.error("[Cron] Database URL is not defined");
    return;
  }

  const sql = neon(databaseUrl);
  for (const item of items) {
    await sql`
          INSERT INTO memo (title, content)
          VALUES (${item.title}, ${item.content})
        `;
    console.log(`[Cron] Inserted record: ${item.title}`);
  }
}

function cleanMagigFile() {
  fs.writeFileSync("data/magic_file.txt", "", "utf-8");
  console.log("[Cron] magic_file.txt cleaned");
}

function getTitleAndContent(
  data: string,
): { title: string; content: string }[] {
  if (!data.trim()) {
    return [];
  }
  const items = data.split("===").map((line) => {
    const seperated = line.split("---");
    const title = seperated[0].trim().replace(/\n/g, " ");
    const content = seperated[1]?.trim().replace(/\n/g, " ") || "";
    return { title, content };
  });
  return items.filter(item => item.title && item.content);
}

console.log(`[Cron] Scheduler will run every ${cronMinutes} minutes`);
