import axios from "axios";
import authSerice from "../AuthService";
import { Playing } from "../types/Playing";

export const getPlaying = async (): Promise<Playing> => {
    const bearerToken = authSerice.getBearer();

    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: 'Bearer ' + bearerToken } });
    if (res.status === 200) {
        console.log('fetched: ', res.data)
        return res.data;
        
    } else {
        console.log(res.statusText)
        throw new Error(res.statusText)
    }

}