import useAuthService from "@/hooks/AuthService";
import { LyricsProps } from "./model";
import { createRef, useEffect, useRef, useState } from "react";
import { geniusSearch } from "@/externalApi/geniusApi/methods/Search";
import axios, { AxiosError } from "axios";

export default function Lyrics(track: LyricsProps) {
  const geniusAuthService = useAuthService("genius");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [text, setText] = useState<string>("");

  useEffect(() => {
    const isLoggedIn = geniusAuthService.isLoggedIn();
    setIsLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      fetchSong();
    }
  }, [track]);

  const fetchSong = async () => {
    try {
      const search = await geniusSearch(geniusAuthService.getBearer(), track);
      const geniusSongId = search.response.hits.find((h) => h.type == "song")
        ?.result.id;
      const a = `//genius.com/songs/${geniusSongId}/embed.js`;

      axios.get(a).then((res) => {
        const s = res.data as string;
        const reg = new RegExp(/<div.*<iframe/gm);
        let part = reg.exec(s)![0];
        part = part.substring(0, part.length - 13);

        part = part.replaceAll("\\\\\\", "\\");
        part = part.replaceAll("\\\\", "\\");

        part = removeHtmlTags2(part);
        part = part.replaceAll("\\n", "\n").replaceAll("\\", "");
        part = part.replace(/(\n)*Powered by Genius(\n)*/gm, "");
        setText(part);
      });
    } catch (e) {
      const error = e as AxiosError;
      if (error.status == 401) {
        geniusAuthService.clear();
        setIsLoggedIn(false);
      }
    }
  };

  const removeHtmlTags = (input: string) => {
    const d = document.createElement("div");
    d.innerHTML = input;
    const result = d.innerText;
    d.remove();
    return result;
  };

  const removeHtmlTags2 = (input: string) => {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div>
      {!isLoggedIn && (
        <a href="/api/genius/login">
          <div className="bg-slate-500 mt-20 mx-auto p-4 w-64">
            Login to genius to see lyrics
          </div>
        </a>
      )}
      <div className="flex justify-center p-4">
        <p className="whitespace-pre-line bg-black w-fit px-24">{text}</p>
      </div>
    </div>
  );
}
