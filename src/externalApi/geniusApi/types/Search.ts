export type Search = {
    meta: {status: string};
    response: SearchReponse;
}

type SearchReponse = {
    hits: Array<Hit>;
}

type Hit = {
    type: 'song' | string;
    result: {
        api_path: string;
        artist_names: string;
        full_title: string;
        path: string;
        id: number;
        title: string;
    }
}