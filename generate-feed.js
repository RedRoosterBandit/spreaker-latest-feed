import fs from "fs/promises";

const SHOW_ID = "6900254";
const SHOW_TITLE = "Podcast Feed";
const SHOW_LINK = "https://www.spreaker.com/show/6900254";

async function main() {

  const url = `https://api.spreaker.com/v2/shows/${SHOW_ID}/episodes?limit=5&sorting=newest`;

  const response = await fetch(url);
  const data = await response.json();

  const episodes = data.response.items;

  const items = episodes.map(ep => {

    const audio = ep.download_url || ep.playback_url || "";

    return `
<item>
<title><![CDATA[${ep.title}]]></title>
<link>${ep.site_url}</link>
<description><![CDATA[${ep.description || ""}]]></description>
<pubDate>${new Date(ep.published_at).toUTCString()}</pubDate>
<guid>${ep.episode_id}</guid>
<enclosure url="${audio}" type="audio/mpeg"/>
</item>`;

  }).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${SHOW_TITLE}</title>
<link>${SHOW_LINK}</link>
${items}
</channel>
</rss>`;

  await fs.mkdir("docs", { recursive: true });

  await fs.writeFile("docs/feed.xml", rss);

  await fs.writeFile("docs/.nojekyll", "");

  await fs.writeFile("docs/index.html", "<a href='./feed.xml'>RSS Feed</a>");

}

main();
