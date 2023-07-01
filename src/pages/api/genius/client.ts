import { AuthorizationCode } from "simple-oauth2";

const config = {
  client: {
    id: process.env.genius_client_id || "",
    secret: process.env.genius_secret || "",
  },
  auth: {
    tokenHost: "https://api.genius.com/oauth/authorize",
  },
};

export const client = new AuthorizationCode(config);
