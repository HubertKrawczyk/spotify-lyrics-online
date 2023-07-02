"use client";

import Lyrics from "@/app/components/Lyrics";
import Player from "@/app/components/Player";
import { getUserProfile } from "@/externalApi/spotifyApi/methods/GetUserProfile";
import { TrackDto } from "@/externalApi/spotifyApi/types/TrackDto";
import { UserProfile } from "@/externalApi/spotifyApi/types/UserProfile";
import useAuthService from "@/hooks/AuthService";
import { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

function getHashParams() {
  var hashParams: { [name: string]: string } = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    if (e) hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export default function Home() {
  const spotifyAuthService = useAuthService('spotify');
  const geniusAuthService = useAuthService('genius');
  
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<TrackDto | undefined>(
    undefined
  );

  const processHashParams = (params: { [name: string]: string }) => {
    console.log(params)
    if (params.spotify_error) {
      spotifyAuthService.clear();
    } else if (params.spotify_access_token) {
      spotifyAuthService.setBearer(params.spotify_access_token);
      if (params.spotify_refresh_token) {
        spotifyAuthService.setRefresh(params.spotify_refresh_token);
      }
      if (params.spotify_token_expires_at) {
        spotifyAuthService.setExpiresAt(params.spotify_token_expires_at);
      }
    }

    if(params.genius_access_token){
      geniusAuthService.setBearer(params.genius_access_token);
    }
  };

  const setProfile = async () => {
    try {
      const profile = await getUserProfile(spotifyAuthService.getBearer());
      setUserProfile(profile);
    } catch (e: any) {
      console.log(e);
      const err = e as AxiosError;
      if (err.response?.status === 401) {
        spotifyAuthService.clear();
        setIsLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    // the most important feature:
    const randomBgNo = (new Array(5).fill(1)).concat(new Array(4).fill(2)).concat(new Array(3).fill(3)).concat(new Array(2).fill(4))[Math.floor(Math.random()*14)]
    document.body.style.backgroundImage = "url(/bg" + (1 + Math.floor(Math.random() * randomBgNo)) + ".png)";

    var params = getHashParams();
    if (params) processHashParams(params);

    const isLoggedIn = spotifyAuthService.isLoggedIn();
    setIsLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      setProfile();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="jumbotron text-center w-full">
        {isLoggedIn && (
          <>
            <p className="py-1">Logged in as {userProfile?.display_name}</p>
            <Player trackChanged={setCurrentTrack} />
            {currentTrack && <Lyrics {...currentTrack} />}
          </>
        )}

        {!isLoggedIn && (
          <Link href="/api/spotify/login">
            <div className="bg-slate-500 mt-20 mx-auto p-4 w-64 mb-4">
              Login to spotify
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
