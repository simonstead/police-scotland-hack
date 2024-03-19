import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
} from "@azure/openai";

export default class GPT {
  private client;
  private deploymentId: string;

  constructor() {
    const client = new OpenAIClient(
      process.env.BASE_URL!,
      new AzureKeyCredential(process.env.OPENAI_API_KEY!)
    );

    this.client = client;
    this.deploymentId = "gpt-35-turbo";
  }

  async complete(prompt: string): Promise<string> {
    const completion = await this.client.getCompletions({
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

  async streamComplete(prompt: string) {
    const messages: ChatRequestMessage[] = [
      {
        role: "system",
        content: "You are a helpful assistant. You will talk like a pirate.",
      },
    ];
    const events = await this.client.streamChatCompletions(
      this.deploymentId,
      messages,
      {
        maxTokens: 128,
      }
    );
    for await (const event of events) {
      for (const choice of event.choices) {
        const delta = choice.delta?.content;
        if (delta !== undefined) {
          console.log(`Chatbot: ${delta}`);
        }
      }
    }
  }
}
