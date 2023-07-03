import axios from "axios";
import { Playing } from "../types/Playing";
import { TrackDto } from "../types/TrackDto";

export const getPlaying = async (bearerToken: string): Promise<TrackDto> => {
    try{
    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: 'Bearer ' + bearerToken } });
    
    if (res.status === 200) {
        const track = res.data as Playing;
        return {
            artistName: track.item.artists[0].name,
            albumName: track.item.album.name,
            imageUrl: track.item.album.images[0].url,
            trackName: track.item.name,
            isPlaying: track.is_playing,
            playingType: track.currently_playing_type
        }
        
    } else {
        throw new Error(res.statusText)
    }}
    catch(e){

        throw e;
    }

}
