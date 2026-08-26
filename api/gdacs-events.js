export default async function handler(req, res) {
  const feeds = [
    ['EQ', 'https://www.gdacs.org/contentdata/xml/gdacsEQ.geojson', 'earthquake'],
    ['FL', 'https://www.gdacs.org/contentdata/xml/gdacsFL.geojson', 'flood'],
    ['TC', 'https://www.gdacs.org/contentdata/xml/gdacsTC.geojson', 'storm'],
    ['VO', 'https://www.gdacs.org/contentdata/xml/gdacsVO.geojson', 'volcano'],
    ['WF', 'https://www.gdacs.org/contentdata/xml/gdacsWF.geojson', 'fire']
  ];
  try {
    const results = await Promise.allSettled(feeds.map(async ([code, url, type]) => {
      const r = await fetch(url, { headers: { Accept: 'application/geo+json, application/json' } });
      if (!r.ok) throw new Error(`${code} ${r.status}`);
      const payload = await r.json();
      return { code, type, payload };
    }));
    const events = [];
    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { code, type, payload } = result.value;
      for (const f of payload.features || []) {
        const c = f.geometry?.coordinates;
        const p = f.properties || {};
        let lon = Array.isArray(c) ? c[0] : null;
        let lat = Array.isArray(c) ? c[1] : null;
        if (Array.isArray(c?.[0])) {
          const point = c.flat(Infinity);
          lon = point[0]; lat = point[1];
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        const title = p.name || p.eventname || p.eventName || p.title || `${code} event`;
        const id = p.eventid || p.eventId || p.id || f.id || `${code}-${lat}-${lon}-${p.fromdate || ''}`;
        events.push({
          id: `gdacs-${code}-${id}`,
          name: title,
          type,
          lat,
          lon,
          source: 'GDACS',
          kind: 'official',
          alertLevel: p.alertlevel || p.alertLevel || p.alert || p.level || null,
          magnitude: p.magnitude ?? p.mag ?? null,
          time: p.fromdate || p.eventdate || p.date || null,
          url: p.url || p.link || 'https://www.gdacs.org/',
          detail: p.description || `${code} · Global Disaster Alert and Coordination System`
        });
      }
    }
    const unique = Array.from(new Map(events.map(e => [e.id, e])).values()).slice(0, 600);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ source: 'GDACS', generated: Date.now(), count: unique.length, events: unique });
  } catch (error) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(502).json({ source: 'GDACS', error: 'Live source temporarily unavailable', events: [] });
  }
}
