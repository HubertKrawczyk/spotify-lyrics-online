import axios from "axios";
import authSerice from "../AuthService";
import { UserProfile } from "../types/UserProfile";

export const getUserProfile = async (): Promise<UserProfile> => {
    const bearerToken = authSerice.getBearer();

    const res = await axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: 'Bearer ' + bearerToken } });
    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error(res.statusText)
    }

}