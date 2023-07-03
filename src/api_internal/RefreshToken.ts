import axios from "axios";

/** @output access token and expiresIn in seconds */
export const refreshSpotifyToken = async (
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number }> => {
  try {
    const res = await axios.post(
      "/api/spotify/refresh",
      {refreshToken},
    );

    if (res.status === 200) {
      const newToken = res.data as { accessToken: string; expiresIn: number };
      return {
        accessToken: newToken.accessToken,
        expiresIn: newToken.expiresIn,
      };
    } else {
      throw new Error(res.statusText);
    }
  } catch (e) {
    throw e;
  }
};
