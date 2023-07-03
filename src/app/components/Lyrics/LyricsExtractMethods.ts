import { LyricsProps } from "./model";
import axios from "axios";
import geniusApi from "@/api_external/genius/api";

const prepareTrackName = (trackName: string) => {
  return trackName.replaceAll("- edit", "");
};

export async function geniusGetLyricsForTrack(track: LyricsProps) {
  const search = await geniusApi.search({
    ...track,
    trackName: prepareTrackName(track.trackName),
  });
  const geniusSongId = search.response.hits.find((h) => h.type == "song")
    ?.result.id;
  const embedLink = `//genius.com/songs/${geniusSongId}/embed.js`;

  const getEmbedRes = await axios.get(embedLink);
  const scriptBody = getEmbedRes.data as string;

  const reg = new RegExp(/<div.*<iframe/gm);

  let result = reg.exec(scriptBody)![0];
  result = result.substring(0, result.length - 13);

  result = result.replaceAll("\\\\\\", "\\");
  result = result.replaceAll("\\\\", "\\");

  result = removeHtmlTags2(result);
  result = result.replaceAll("\\n", "\n").replaceAll("\\", "");
  result = result.replace(/(\n)*Powered by Genius(\n)*/gm, "");
  return result;
}

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
