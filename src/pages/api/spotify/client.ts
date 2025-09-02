import { AuthorizationCode } from "simple-oauth2";

const config = {
  client: {
    id: process.env.spotify_client_id || "",
    secret: process.env.spotify_secret || "",
  },
  auth: {
    authorizeHost: "https://accounts.spotify.com/",
    authorizePath: "/authorize",
    tokenHost: "https://accounts.spotify.com/",
    tokenPath: "/api/token",
  },
};

export const client = new AuthorizationCode(config);

export default function handler(_req: any, _res: any) {
  return new Response("don't", { status: 404 });
}