export interface OmdbMovie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: 'movie' | 'series' | 'episode';
    imdbRating?: string;
    Genre?: string;
    Director?: string;
    Actors?: string;
    Plot?: string;
    Runtime?: string;
    Awards?: string;
    totalSeasons?: string;
}

export type WatchStatus = 'watched' | 'watching' | 'plan_to_watch';

export interface WatchlistEntry extends OmdbMovie {
    status: WatchStatus;
    myRating?: number;
    myNotes?: string;
    dateAdded: number;
    genres: string[];
}