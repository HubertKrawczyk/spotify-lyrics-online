import useAuthService from "@/hooks/AuthService";
import axios, { AxiosError } from "axios";

const geniusInterceptorInstance = axios.create({
  baseURL: "https://api.genius.com/", // Replace with your API base URL
});

geniusInterceptorInstance.interceptors.request.use(
  (config) => {
    const geniusAuthService = useAuthService("genius");
    const accessToken = geniusAuthService.getBearer();

    if (accessToken) {
      if (config.url?.includes("?"))
        config.url = config.url + `&access_token=${accessToken}`;
      else config.url = config.url + `?access_token=${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

geniusInterceptorInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default geniusInterceptorInstance;
