export default async function handler(req, res) {
  try {
    const source = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    const response = await fetch(source, { headers: { 'Accept': 'application/geo+json' } });
    if (!response.ok) throw new Error(`USGS ${response.status}`);
    const payload = await response.json();
    const features = (payload.features || []).map((f) => ({
      id: `usgs-${f.id}`,
      name: f.properties?.place || 'Earthquake',
      type: 'earthquake',
      lat: f.geometry?.coordinates?.[1],
      lon: f.geometry?.coordinates?.[0],
      depth: f.geometry?.coordinates?.[2],
      magnitude: f.properties?.mag,
      time: f.properties?.time,
      updated: f.properties?.updated,
      source: 'USGS',
      kind: 'official',
      url: f.properties?.url || 'https://earthquake.usgs.gov/earthquakes/map/',
      detail: `Magnitud ${f.properties?.mag ?? '—'} · ${f.properties?.place || 'evento sísmico'}`
    })).filter((e) => Number.isFinite(e.lat) && Number.isFinite(e.lon));
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ source: 'USGS', generated: payload.metadata?.generated || Date.now(), count: features.length, events: features });
  } catch (error) {
    res.status(502).json({ source: 'USGS', error: 'Live source temporarily unavailable', events: [] });
  }
}
