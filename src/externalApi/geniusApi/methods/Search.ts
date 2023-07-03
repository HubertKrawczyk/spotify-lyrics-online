import axios from "axios";
import { Search } from "../types/Search";
import { TrackDto } from "@/externalApi/spotifyApi/types/TrackDto";

export const search = async (
  bearerToken: string,
  track: {
    artistName: string;
    trackName: string;
  }
): Promise<Search> => {
  try {
    const res = await axios.get(
      `https://api.genius.com/search?q=${encodeURIComponent(
        track.artistName
      )}%20${encodeURIComponent(track.trackName)}&access_token=${bearerToken}`
      // ,{ headers: { Authorization: "Bearer " + bearerToken } }
    );

    if (res.status === 200) {
      const search = res.data as Search;
      return search;
    } else {
      throw new Error(res.statusText);
    }
  } catch (e) {
    
    throw e;
  }
};
