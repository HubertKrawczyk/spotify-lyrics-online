"use client";

import { useEffect, useState } from "react";
import { PlayerProps } from "./props";
import useAuthService from "@/hooks/AuthService";
import { TrackDto } from "@/externalApi/spotifyApi/types/TrackDto";
import { getPlaying } from "@/externalApi/spotifyApi/methods/GetPlaying";

export default function Player(props: PlayerProps) {
  const spotifyAuthService = useAuthService("spotify");
  const [track, setTrack] = useState<TrackDto>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaying();
  }, []);

  const fetchPlaying = async () => {
    setIsLoading(true);
    try {
      const playing = await getPlaying(spotifyAuthService.getBearer());
      setTrack(playing);
      props.trackChanged(playing);
    } catch (e) {
      console.log(e);
      props.trackChanged(undefined);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full bg-green-700 relative">
      {isLoading ? (
        <p className="bg-green-900">Loading</p>
      ) : (
        <>
          <p className="bg-green-900">
            {track?.isPlaying ? "Playing" : "Not Playing"}
          </p>
          {track ? (
            <div className="py-3 px-7 flex h-32 gap-8 md:gap-16 items-center">
              <img src={track.imageUrl} className="rounded-full h-20"></img>
              <div className="flex flex-col justify-center items-start text-base md:text-2xl">
                <h4>
                  <small>
                    <i>{track.trackName}</i>
                  </small>
                </h4>
                <h4>
                  <span className="font-semibold">Album </span>
                  <small>
                    <i>{track.albumName}</i>
                  </small>
                </h4>
                <h4>
                  <span className="font-semibold">Artist </span>
                  <small>
                    <i>{track.artistName}</i>
                  </small>
                </h4>
              </div>
            </div>
          ) : (
            <p className="py-4">Cannot get item</p>
          )}

          <button
            className="absolute right-0 top-0 h-full w-16 md:w-24 bg-slate-600 hover:bg-slate-400 bg-opacity-40 flex"
            onClick={fetchPlaying}
          >
            <p alt-text="refresh" className="text-3xl md:text-5xl m-auto">
              ↻
            </p>
          </button>
        </>
      )}
    </div>
  );
}
