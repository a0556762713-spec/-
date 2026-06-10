import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // GoogleGenAI initialization
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Route - Search YouTube
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      console.log(`Searching YouTube for: "${query}"`);
      const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'he,he-IL,en;q=0.9'
        }
      });

      if (!response.ok) {
        throw new Error(`YouTube responded with status ${response.status}`);
      }

      const html = await response.text();
      
      // Extract ytInitialData JSON
      let ytInitialData: any = null;
      const matches = [
        /ytInitialData\s*=\s*({.+?});/,
        /var\s+ytInitialData\s*=\s*({.+?});/,
        /window\['ytInitialData'\]\s*=\s*({.+?});/
      ];

      for (const regex of matches) {
        const match = html.match(regex);
        if (match) {
          try {
            ytInitialData = JSON.parse(match[1]);
            break;
          } catch (e) {
            // continue
          }
        }
      }

      const results: any[] = [];
      const contents = ytInitialData?.contents?.twoColumnSearchResultRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

      if (Array.isArray(contents)) {
        for (const item of contents) {
          if (item.videoRenderer) {
            const vr = item.videoRenderer;
            const videoId = vr.videoId;
            if (!videoId) continue;

            const title = vr.title?.runs?.map((r: any) => r.text).join('') || vr.title?.simpleText || 'Unknown Title';
            const thumbnailInfo = vr.thumbnail?.thumbnails?.[vr.thumbnail.thumbnails.length - 1] || vr.thumbnail?.thumbnails?.[0];
            const thumbnail = thumbnailInfo?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            const duration = vr.lengthText?.simpleText || vr.lengthText?.accessibility?.accessibilityData?.label || '0:00';
            const channelName = vr.ownerText?.runs?.map((r: any) => r.text).join('') || vr.ownerText?.simpleText || 'Unknown Channel';
            const viewCount = vr.viewCountText?.simpleText || '';
            const publishedTime = vr.publishedTimeText?.simpleText || '';

            results.push({
              videoId,
              title,
              thumbnail,
              duration,
              channelName,
              viewCount,
              publishedTime,
              url: `https://www.youtube.com/watch?v=${videoId}`
            });
          }
        }
      }

      // Fallback if scraping didn't yield results
      if (results.length === 0) {
        console.log("Empty search result parsing, running regex watch fallback...");
        const regex = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
        const ids = Array.from(new Set([...html.matchAll(regex)].map(m => m[1])));
        for (const id of ids.slice(0, 15)) {
          results.push({
            videoId: id,
            title: `סרטון/שיר מיוטיוב (${id})`,
            thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            duration: '0:00',
            channelName: 'YouTube Music',
            viewCount: '',
            publishedTime: '',
            url: `https://www.youtube.com/watch?v=${id}`
          });
        }
      }

      res.json({ results });
    } catch (error: any) {
      console.error("YouTube search error:", error);
      res.status(500).json({ error: error.message || "Failed to search YouTube" });
    }
  });

  // API Route - Get Lyrics & Trivia via Gemini
  app.post("/api/lyrics", async (req, res) => {
    try {
      const { title, artist } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      if (!ai) {
        return res.status(200).json({
          lyrics: "מילים לא זמינות. אנא ודא שהגדרת מפתח Gemini API באפשרויות הגדרות של השרת.",
          artistTrivia: ["לא ניתן לטעון עובדות ללא מפתח API פעיל.", "הפעל מפתח API בהגדרות.", "חקור סגנונות חדשים למטה!"],
          songFacts: "מידע על השיר זמין כאשר Gemini מופעל."
        });
      }

      const prompt = `You are a helpful YouTube Music guide. Produce the song lyrics and trivia for the song "${title}" by artist "${artist || 'Unknown'}". 
      Provide the actual lyrics (if the song is in English, provide English lyrics followed by a beautiful Hebrew translation; if it's in Hebrew, just provide the Hebrew lyrics).
      Provide 3 interesting trivia facts about the artist or song in Hebrew.
      Provide a brief sentimental explanation/background of the song in Hebrew.
      All text must be extremely polished and formatted nicely. Ensure everything is returned as structured JSON output.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lyrics: { type: Type.STRING, description: "Song lyrics, beautifully formatted with lines" },
              artistTrivia: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Array of exactly 3 interesting trivia facts about the artist/song in Hebrew" 
              },
              songFacts: { type: Type.STRING, description: "A elegant and sentimental background description of the song in Hebrew" }
            },
            required: ["lyrics", "artistTrivia", "songFacts"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error("Gemini lyrics error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch details via Gemini" });
    }
  });

  // API Route - Get similar song recommendations via Gemini
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const queryStr = String(query).trim();

      if (!ai) {
        // High-quality static fallback recommendations
        const fallbacks = [
          {
            title: "Bohemian Rhapsody",
            artist: "Queen",
            year: "1975",
            reason: "יצירת מופת נצחית עם מגוון סגנונות מוזיקליים שמתאימה לכל חובב מוזיקה איכותית.",
            searchQuery: "Queen - Bohemian Rhapsody"
          },
          {
            title: "Imagine",
            artist: "John Lennon",
            year: "1971",
            reason: "שיר שלום ואחווה מרגש עם לחן פסנתר פשוט ומדהים שיחמם לכם את הלב.",
            searchQuery: "John Lennon - Imagine"
          },
          {
            title: "Clair de Lune",
            artist: "Claude Debussy",
            year: "1905",
            reason: "יצירה קלאסית רגועה וחולמנית שתשרה עליכם שלווה מוחלטת.",
            searchQuery: "Claude Debussy - Clair de Lune"
          },
          {
            title: "Someone Like You",
            artist: "Adele",
            year: "2011",
            reason: "בלדה עוצמתית ומרגשת על אהבה וגעגוע שנוגעת בכל הנימים.",
            searchQuery: "Adele - Someone Like You"
          },
          {
            title: "Yellow",
            artist: "Coldplay",
            year: "2000",
            reason: "המנון בריטפופ חמים ואופטימי עם אנרגיות נהדרות ומלודיה סוחפת.",
            searchQuery: "Coldplay - Yellow"
          }
        ];
        return res.json({ recommendations: fallbacks });
      }

      const prompt = `Based on the song or search query: "${queryStr}", suggest exactly 5 similar or recommended songs that a user enjoying "${queryStr}" would love.
      The suggestions must adapt dynamically to the genre, mood, or artist of the query (e.g., if the query is a Hebrew song like "Omer Adam", suggest modern Hebrew pop songs; if it's piano classical, suggest beautiful classical/neoclassical tracks; if it's rock, suggest high-quality rock).
      For each of the 5 recommendations, provide:
      1. The song title (in its original language, e.g. English, Hebrew, etc., with correct spelling).
      2. The artist name (e.g. Omer Adam, Queen, Coldplay).
      3. The release year (represented as a string like "2020", "1994", or approximate).
      4. A brief, charming one-sentence explanation/reason of why this fits the search or why they will love it, written in beautifully polished Hebrew.
      5. A clean, optimized search query to find this exact track on YouTube easily (e.g., "Adele - Hello").
      
      Generate a valid JSON object matching the requested schema. Do not include markdown wraps in your text description.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                    year: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "One sentence in Hebrew explaining why this is suggested to the user" },
                    searchQuery: { type: Type.STRING, description: "Exact YouTube search query to find the video" }
                  },
                  required: ["title", "artist", "year", "reason", "searchQuery"]
                },
                description: "Array of exactly 5 recommendations"
              }
            },
            required: ["recommendations"]
          }
        }
      });

      const data = JSON.parse(response.text || '{"recommendations": []}');
      res.json(data);
    } catch (error: any) {
      console.error("Gemini recommendation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate recommendations" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
