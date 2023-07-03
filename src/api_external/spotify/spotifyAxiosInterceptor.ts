import { refreshSpotifyToken } from "@/api_internal/RefreshToken";
import useAuthService from "@/hooks/AuthService";
import axios, { AxiosError } from "axios";

const spotifyInterceptorInstance = axios.create({
  baseURL: "https://api.spotify.com/v1/", // Replace with your API base URL
});

spotifyInterceptorInstance.interceptors.request.use(
  (config) => {
    const spotifyAuthService = useAuthService("spotify");
    const accessToken = spotifyAuthService.getBearer();

    if (accessToken) {
      if (config.headers)
        config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

spotifyInterceptorInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError & { config: { _retry: boolean | undefined } }) => {
    const originalRequest = error.config;
    const spotifyAuthService = useAuthService("spotify");
    
    if (
      error.response!.status === 403 ||
      (error.response!.status === 401 &&
        !originalRequest!._retry &&
        spotifyAuthService.canRefreshToken())
    ) {
      originalRequest._retry = true;
      const { accessToken, expiresIn } = await refreshSpotifyToken(
        spotifyAuthService.getRefresh()!
      );
      if (accessToken) {
        spotifyAuthService.setBearer(accessToken);
        spotifyAuthService.setExpiresAt(Date.now() + 1000 * expiresIn);
        originalRequest.headers.Authorization = "Bearer " + accessToken;

        return spotifyInterceptorInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default spotifyInterceptorInstance;
