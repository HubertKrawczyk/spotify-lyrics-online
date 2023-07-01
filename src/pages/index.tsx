"use client";

import Player from "@/app/components/Player";
import authSerice from "@/spotifyApi/AuthService";
import { getUserProfile } from "@/spotifyApi/methods/GetUserProfile";
import { UserProfile } from "@/spotifyApi/types/UserProfile";
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
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const processParams = (params: { [name: string]: string }) => {
    if (params.error) {
      authSerice.clear();
    } else if (params.access_token) {
      authSerice.setBearer(params.access_token);
      if (params.refresh_token) {
        authSerice.setRefresh(params.refresh_token);
      }
    }
  };

  const setProfile = async () => {
    const profile = await getUserProfile();
    setUserProfile(profile);
  };

  useEffect(() => {
    var params = getHashParams();
    if (params) processParams(params);

    const isLoggedIn = authSerice.isLoggedIn();
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
            <Player />
          </>
        )}

        {!isLoggedIn && (
          <a href="/api/login">
            <div className="bg-slate-500 mt-20 mx-auto p-4 w-64">
              Login to spotify
            </div>
          </a>
        )}
      </div>
    </main>
  );
}
