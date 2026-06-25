const KEY = import.meta.env.VITE_OMDB_KEY;
const BASE = 'https://www.omdbapi.com';

// Search by title — returns array of results
export async function searchMovies(query: string, page = 1) {
    const res = await fetch(
        `${BASE}/?s=${encodeURIComponent(query)}&page=${page}&apikey=${KEY}`
    );
    const data = await res.json();
    return data.Search ?? [];
}

// Get full details by IMDB ID
export async function getMovieDetails(imdbId: string) {
    const res = await fetch(`${BASE}/?i=${imdbId}&plot=full&apikey=${KEY}`);
    return res.json();
}

// Search with type filter (movie or series)
export async function searchByType(query: string, type: 'movie' | 'series') {
    const res = await fetch(
        `${BASE}/?s=${encodeURIComponent(query)}&type=${type}&apikey=${KEY}`
    );
    const data = await res.json();
    return data.Search ?? [];
}