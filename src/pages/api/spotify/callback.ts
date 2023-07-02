import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";
import queryString from "query-string";
import { spotifyStateKey } from "./login";
import { app_url } from "@/pages/_app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[spotifyStateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
    return;
  }

  //delete cookie
  res.setHeader(
    "Set-Cookie",
    `${spotifyStateKey}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  const authorizationOptions = {
    code: code as string,
    redirect_uri: app_url + "/api/spotify/callback",
  };

  const token = (await client.getToken(authorizationOptions)).token;

  res.redirect(
    "/#" +
      queryString.stringify({
        spotify_access_token: token.access_token,
        spotify_refresh_token: token.refresh_token,
        spotify_token_expires_at: token.expires_at,
      })
  );
}
