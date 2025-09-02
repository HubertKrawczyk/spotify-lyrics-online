import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";
import { app_url } from "@/pages/_app";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = crypto.randomBytes(16).toString("hex"); //CSRF protection

  const authorizeUri = client.authorizeURL({
    redirect_uri: `${app_url}/api/genius/callback`,
    scope: "me",
    state,
  });

  res.redirect(authorizeUri);
}
