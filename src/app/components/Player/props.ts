import { TrackDto } from "@/externalApi/spotifyApi/types/TrackDto";

export type PlayerProps = {
    trackChanged: (track: TrackDto | undefined) => void;
}