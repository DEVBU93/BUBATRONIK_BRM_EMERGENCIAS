export default async function handler(req, res) {
  const feedUrl = 'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain';
  try {
    const response = await fetch(feedUrl, { headers: { Accept: 'application/atom+xml, application/xml, text/xml' } });
    if (!response.ok) throw new Error(`MeteoAlarm ${response.status}`);
    const xml = await response.text();
    const entries = [...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)].map(m => m[0]);
    const clean = value => (value || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const tag = (block, name) => clean(block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1]);
    const events = entries.map((block, index) => {
      const title = tag(block, 'title') || 'Aviso meteorológico';
      const summary = tag(block, 'summary') || tag(block, 'content');
      const published = tag(block, 'updated') || tag(block, 'published');
      const area = tag(block, 'georss:featurename') || tag(block, 'areaDesc') || '';
      const event = tag(block, 'event') || title;
      const severity = tag(block, 'severity') || '';
      const urgency = tag(block, 'urgency') || '';
      const point = block.match(/<georss:point[^>]*>([^<]+)<\//i)?.[1];
      const box = block.match(/<georss:box[^>]*>([^<]+)<\//i)?.[1];
      let lat = null, lon = null;
      if (point) {
        const p = point.trim().split(/\s+/).map(Number);
        [lat, lon] = p.length >= 2 ? p : [null, null];
      } else if (box) {
        const p = box.trim().split(/\s+/).map(Number);
        if (p.length >= 4) { lat = (p[0] + p[2]) / 2; lon = (p[1] + p[3]) / 2; }
      }
      const href = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || 'https://www.meteoalarm.org/';
      return {
        id: `meteoalarm-es-${index}-${Buffer.from(title).toString('base64').slice(0, 12)}`,
        name: title,
        type: /incend|forest|fuego/i.test(`${title} ${event}`) ? 'fire' : 'weather',
        lat, lon, area, event, severity, urgency,
        time: published || null,
        source: 'METEOALARM-ES',
        kind: 'official',
        url: href,
        detail: clean(summary).slice(0, 500)
      };
    }).filter(e => e.name);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ source: 'METEOALARM-ES', generated: Date.now(), count: events.length, events });
  } catch (error) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(502).json({ source: 'METEOALARM-ES', error: 'Spain alert feed temporarily unavailable', events: [] });
  }
}
