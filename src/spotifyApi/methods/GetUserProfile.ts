import axios from "axios";
import { UserProfile } from "../types/UserProfile";

export const getUserProfile = async (bearerToken: string): Promise<UserProfile> => {
    const res = await axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: 'Bearer ' + bearerToken } });
    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error(res.statusText)
    }

}