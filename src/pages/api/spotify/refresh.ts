import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.status(400).send("No refresh token sent");
    return;
  }

  console.log(process.env.spotify_client_id + ":" + process.env.spotify_secret);
  const refreshReq = await axios.post(
    "https://accounts.spotify.com/api/token",
    { grant_type: "refresh_token", refresh_token: refreshToken },
    {
      headers: {
        Authorization: `Basic ${new Buffer(
          process.env.spotify_client_id + ":" + process.env.spotify_secret
        ).toString("base64")}`,
        Accept: "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (refreshReq.status === 200) {
    res.send({
      accessToken: refreshReq.data.access_token,
      expiresIn: refreshReq.data.expires_in,
    });
    return;
  }

  res.status(500).send("Error");
}
