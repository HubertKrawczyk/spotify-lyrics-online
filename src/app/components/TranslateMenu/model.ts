import { LyricsProps } from "../Lyrics/model";

export type Translation = {
    translations: string[]
}

export const getTrackLocalstorageId = (lyricProps: LyricsProps): string => {
    return "translation:" + lyricProps.artistName+ ":" +lyricProps.trackName;
}