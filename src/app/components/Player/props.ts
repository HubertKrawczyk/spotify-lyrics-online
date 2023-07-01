import { LyricsProps } from "../Lyrics/model";

export type PlayerProps = {
    trackChanged: (track: LyricsProps | undefined) => void;
}