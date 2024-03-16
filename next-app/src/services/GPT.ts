import OpenAI from "openai";

export default class GPT {
  private client: OpenAI;

  constructor() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.client = openai;
  }

  async complete(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content || "";
  }
}
