import { UserProfile } from "../types/UserProfile";
import spotifyInterceptorInstance from "../spotifyAxiosInterceptor";

export const getUserProfile = async (): Promise<UserProfile> => {
    const res = await spotifyInterceptorInstance.get('/me');
    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error(res.statusText)
    }

}