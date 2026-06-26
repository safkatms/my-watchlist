const KEY = import.meta.env.VITE_YOUTUBE_KEY;

export async function getTrailerKey(title: string, year: string): Promise<string | null> {
    const query = `${title} ${year} official trailer`;
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${KEY}`
    );
    const data = await res.json();
    return data.items?.[0]?.id?.videoId ?? null;
}