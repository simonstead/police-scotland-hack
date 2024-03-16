// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import GPT from "../../services/GPT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const gpt = new GPT();
  const prompt = req.body.prompt;
  const response = await gpt.complete(prompt);
  res.status(200).json({ response });
}
