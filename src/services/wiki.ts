export async function searchWikipediaNearby(latitude: number, longitude: number) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=${latitude}|${longitude}&gsradius=10000&gslimit=20&origin=*`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Failed to query Wikipedia');
  const data = await resp.json();
  return (data?.query?.geosearch ?? []) as Array<{ pageid: number; title: string; lat: number; lon: number; dist: number }>; 
}

export async function fetchWikipediaSummary(title: string) {
  const resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (!resp.ok) return null;
  return await resp.json();
}

export async function fetchNearbyFirstTitle(latitude: number, longitude: number): Promise<string | null> {
  try {
    const list = await searchWikipediaNearby(latitude, longitude);
    return list?.[0]?.title ?? null;
  } catch {
    return null;
  }
}


