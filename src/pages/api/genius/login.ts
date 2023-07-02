import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";
import { app_url } from "@/pages/_app";

const authorizeUri = client.authorizeURL({
  redirect_uri: app_url + "/api/genius/callback",
  
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(authorizeUri);
}
