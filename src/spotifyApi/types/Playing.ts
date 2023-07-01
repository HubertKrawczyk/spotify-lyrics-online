export type Playing = {
    is_playing: boolean;
    currently_playing_type: string;
    item: PlayingItem;
}

type PlayingItem = {
    name: string;
    album: Album;
    artists: Array<Artist>;
}

type Album = {
    name: string;
    images: Array<Image>;
}

type Image = {
    url: string;
    height: string;
    width: string;
}

type Artist = {
    name: string;
}