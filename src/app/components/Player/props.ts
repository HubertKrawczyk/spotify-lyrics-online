import { TrackDto } from "@/api_external/spotify/types/TrackDto";

export type PlayerProps = {
  onTrackChanged: (track: TrackDto | undefined) => void;
};
