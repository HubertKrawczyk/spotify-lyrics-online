"use client";

import { getPlaying } from "@/spotifyApi/methods/GetPlaying";
import { Playing } from "@/spotifyApi/types/Playing";
import { useEffect, useState } from "react";

export default function Player() {
  const [player, setPlayer] = useState<Playing>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchPlaying();
  }, []);

  const fetchPlaying = async () => {
    setIsLoading(true);
    try {
      const playing = await getPlaying();
      setPlayer(playing);
    } catch (e) {
      console.log(e);
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
            {player?.is_playing ? "Playing" : "Not Playing"}
          </p>
          {player?.item ? (
            <div className="py-3 px-7 flex h-32 gap-16 items-center">
              <img
                src={player.item.album.images[0].url}
                className="rounded-full h-20"
              ></img>
              <div className="flex flex-col justify-center items-start text-2xl">
                <h4>
                  <small>
                    <i>{player.item.name}</i>
                  </small>
                </h4>
                <h4>
                  <span className="font-semibold">Album </span>
                  <small>
                    <i>{player.item.album.name}</i>
                  </small>
                </h4>
                <h4>
                  <span className="font-semibold">Artist</span>{" "}
                  <small>
                    <i>{player.item.artists[0].name}</i>
                  </small>
                </h4>
              </div>
            </div>
          ) : (
            <p className="py-4">Cannot get item</p>
          )}

          <button
            className="absolute right-0 top-0 h-full w-24 bg-slate-600 hover:bg-slate-400 bg-opacity-40 flex"
            onClick={fetchPlaying}
          >
            <p alt-text="refresh" className="text-5xl m-auto">
              ↻
            </p>
          </button>
        </>
      )}
    </div>
  );
}
