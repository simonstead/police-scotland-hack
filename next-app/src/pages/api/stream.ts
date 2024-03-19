import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
} from "@azure/openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const deploymentName = "gpt-35-turbo";
  // Set response headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  const { message } = req.body;
  console.log(message);

  const prompt = `Summarize the following incident report in less than 30 words:
                    ${message}
                `;
  const messages: ChatRequestMessage[] = [{ role: "user", content: prompt }];
  const options = {
    maxTokens: 128,
  };
  const client = new OpenAIClient(
    process.env.BASE_URL!,
    new AzureKeyCredential(process.env.OPENAI_API_KEY!)
  );

  // Start streaming the chat completions
  const events = await client.streamChatCompletions(
    deploymentName,
    messages,
    options
  );

  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content;
      if (delta === undefined) {
        continue;
      }
      res.write(delta);
    }
  }
};
