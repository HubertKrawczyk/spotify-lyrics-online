import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";
import queryString from "query-string";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var code = req.query.code || null;
  const options = {
    code: code as string,
    redirect_uri: "http://localhost:3000/api/genius/callback",
  };

  const genius_access_token = (await client.getToken(options)).token.access_token;

  res.redirect('/#' +
  queryString.stringify({
      genius_access_token
  }));
}
