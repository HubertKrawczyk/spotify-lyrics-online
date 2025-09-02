import { AuthorizationCode } from "simple-oauth2";

const config = {
  client: {
    id: process.env.genius_client_id || "",
    secret: process.env.genius_secret || "",
  },
  auth: {
    tokenHost: "https://api.genius.com",
    authorizePath: "/oauth/authorize",
    tokenPath: "/oauth/token",
  },
};

export const client = new AuthorizationCode(config);

export default function handler(_req: any, _res: any) {
  return new Response("don't", { status: 404 });
}