import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const env = await load();
const OPENAI_API_KEY = env["OPENAI_API_KEY"];
const OPENAI_URL = "https://api.openai.com/v1/completions";

const router = new Router();
router.post("/", async (context) => {
  const body = await (
    await context.request.body({ type: "json" })
  ).value.read();

  // Setting up headers for OpenAI API request
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  });

  // Making a request to the OpenAI API
  const openaiResponse = await fetch(OPENAI_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Or any other model you wish to use
      prompt: body.prompt,
      temperature: 0.7,
      max_tokens: 100,
    }),
  });

  // Sending back the response from OpenAI API to the client
  const openaiResponseBody = await openaiResponse.json();
  return new Response(JSON.stringify(openaiResponseBody), {
    headers: { "Content-Type": "application/json" },
  });
});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });
