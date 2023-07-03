import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";
import { app_url } from "@/pages/_app";
var generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const params = {
  redirect_uri: app_url + "/api/spotify/callback",
  scope:
    "user-modify-playback-state user-read-currently-playing user-read-private",
  show_dialog: false,
  response_type: "code",
};

export const spotifyStateKey = "spotify_auth_state";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = generateRandomString(16);

  const authorizeUri = client.authorizeURL({ ...params, state });

  res.setHeader("Set-Cookie", `${spotifyStateKey}=${state}`);

  res.redirect(authorizeUri);
}
