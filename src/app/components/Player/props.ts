import { TrackDto } from "@/externalApi/spotifyApi/types/TrackDto";

export type PlayerProps = {
  onTrackChanged: (track: TrackDto | undefined) => void;
  onTokenExpired: () => Promise<boolean>;
};
