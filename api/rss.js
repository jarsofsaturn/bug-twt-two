let posts = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content, date } = req.body;
    if (!content || !date) return res.status(400).end('Missing fields');
    posts.unshift({ content, date });
    return res.status(200).end('Post added!');
  }

  if (req.method === 'GET') {
    const rssItems = posts
      .map((post) => `
        <item>
          <title>${escape(post.content.slice(0, 30))}</title>
          <description>${escape(post.content)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`)
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>twt but for buggie</title>
    <description>buggie’s microblog feed</description>
    <link>https://example.com</link>
    ${rssItems}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml');
    return res.status(200).send(rss);
  }

  res.status(405).end(); // Method Not Allowed
}

function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
