import { Search } from "../types/Search";
import geniusInterceptorInstance from "../geniusAxiosInterceptor";

export const search = async (track: {
  artistName: string;
  trackName: string;
}): Promise<Search> => {
  try {
    const res = await geniusInterceptorInstance.get(
      `/search?q=${encodeURIComponent(track.artistName)}%20${encodeURIComponent(
        track.trackName
      )}`
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
