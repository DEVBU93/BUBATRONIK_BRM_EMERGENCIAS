export default async function handler(req, res) {
  const feeds = ['https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain'];
  try {
    let xml=''; let lastError=null;
    for (const feedUrl of feeds) {
      try { const response = await fetch(feedUrl,{headers:{Accept:'application/atom+xml, application/xml, text/xml'}}); if(!response.ok) throw new Error(`MeteoAlarm ${response.status}`); xml=await response.text(); if(xml) break; } catch(e){ lastError=e; }
    }
    if(!xml) throw (lastError||new Error('No Spain alert feed available'));
    const entries = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m => m[0]);
    const clean = value => (value || '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const tag = (block, name) => {
      const pattern = new RegExp(`<(?:(?:[\\w.-]+):)?${name}\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?${name}>`, 'i');
      return clean(block.match(pattern)?.[1]);
    };
    const link = block => block.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1] || 'https://www.meteoalarm.org/';
    const coordinates = block => {
      const point = block.match(/<(?:(?:[\\w.-]+):)?point\b[^>]*>([^<]+)<\//i)?.[1];
      const box = block.match(/<(?:(?:[\\w.-]+):)?box\b[^>]*>([^<]+)<\//i)?.[1];
      const polygon = block.match(/<(?:(?:[\\w.-]+):)?polygon\b[^>]*>([^<]+)<\//i)?.[1];
      if (point) {
        const p = point.trim().split(/\s+/).map(Number);
        if (p.length >= 2 && p.every(Number.isFinite)) return { lat: p[0], lon: p[1] };
      }
      if (box) {
        const p = box.trim().split(/\s+/).map(Number);
        if (p.length >= 4 && p.slice(0, 4).every(Number.isFinite)) return { lat: (p[0] + p[2]) / 2, lon: (p[1] + p[3]) / 2 };
      }
      if (polygon) {
        const p = polygon.trim().split(/\s+/).map(Number).filter(Number.isFinite);
        if (p.length >= 2) {
          const pairs = [];
          for (let i = 0; i + 1 < p.length; i += 2) pairs.push([p[i], p[i + 1]]);
          if (pairs.length) return {
            lat: pairs.reduce((a, v) => a + v[0], 0) / pairs.length,
            lon: pairs.reduce((a, v) => a + v[1], 0) / pairs.length
          };
        }
      }
      return { lat: null, lon: null };
    };

    const events = entries.map((block, index) => {
      const title = tag(block, 'title') || 'Aviso meteorológico';
      const summary = tag(block, 'summary') || tag(block, 'content');
      const published = tag(block, 'updated') || tag(block, 'published');
      const area = tag(block, 'featurename') || tag(block, 'areaDesc') || tag(block, 'area') || '';
      const event = tag(block, 'event') || title;
      const severity = tag(block, 'severity') || '';
      const urgency = tag(block, 'urgency') || '';
      const c = coordinates(block);
      const idSource = `${title}|${area}|${published}|${index}`;
      return {
        id: `meteoalarm-es-${Buffer.from(idSource).toString('base64').replace(/[^a-z0-9]/gi, '').slice(0, 24)}`,
        name: title,
        type: 'weather',
        lat: c.lat,
        lon: c.lon,
        area,
        event,
        severity,
        urgency,
        time: published || null,
        source: 'METEOALARM-ES',
        scope: 'spain',
        kind: 'official',
        url: link(block),
        detail: clean(summary).slice(0, 600)
      };
    }).filter(e => e.name);

    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
    res.status(200).json({
      source: 'METEOALARM-ES',
      generated: Date.now(),
      count: events.length,
      events
    });
  } catch (error) {
    res.setHeader('Cache-Control', 's-maxage=30');
    res.status(502).json({
      source: 'METEOALARM-ES',
      error: 'Spain alert feed temporarily unavailable',
      events: []
    });
  }
}
