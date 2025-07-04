import { promises as fs } from "fs";
import path from "path";

const countFile = path.join(process.cwd(), "count.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile(countFile, "utf8");
      const count = JSON.parse(data).count;
      res.status(200).json({ count });
    } catch {
      // If file doesn't exist, return count 0
      res.status(200).json({ count: 0 });
    }
  } else if (req.method === "POST") {
    try {
      let count = 0;
      try {
        const data = await fs.readFile(countFile, "utf8");
        count = JSON.parse(data).count || 0;
      } catch {}

      count++;
      await fs.writeFile(countFile, JSON.stringify({ count }));
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
