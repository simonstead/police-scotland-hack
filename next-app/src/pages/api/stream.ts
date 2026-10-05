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
  const prompt = `
  1) Provide a 1 sentence summary of the report
  2) Highlight any contradictions
  3) Provide some tactical options to act on
  4) Do a THRIVE assessment on the following report
  5) assess the risk in these areas: public, physical, pyschological, political and legal, ethical and moral
  6) Suggest some tags a call centre operator could use to categorise the report
  

  Use markdown with bold and headers. The report is here:
"""${message}"""
                `;
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content: `- Act as a professional assistant to a police officer. 
                - Your responses should be based on verifiable facts and should be consistent over time.
                - When summarising information, respond with the most relevant and important information.
                - Where you have interpreted information, make it clear that this is your interpretation.
                - Summarise the incident log provided, using bullet points to highlight the most important information.`,
    },
    { role: "user", content: prompt },
  ];
  const options = {
    maxTokens: 400,
    temperature: 0.2,
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
  res.end();
};
