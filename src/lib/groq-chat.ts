import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type ChatMessage = { role: "user" | "assistant"; content: string };

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
  profile: z.string().optional(),
});

const MAX_HISTORY = 6;

function toGroqMessages(profile: string | undefined, history: ChatMessage[], message: string) {
  const systemParts = [
    "You are Skumar AI, a concise portfolio assistant for Saurav Kumar (Saurabh Kumar Tiwari).",
    "You have complete access to his professional profile including education, skills, projects, experience, services, quotes, system specs, hobbies, and contact information.",
    "Answer with short, helpful replies. Use bullet lists only when it improves clarity.",
    "For any questions about skills, projects, services, experience, education, or contact - use the provided profile data.",
    "If a question is outside the portfolio scope, politely say you do not have that information.",
    "Maintain a professional but friendly tone. Reference his core quotes when relevant.",
  ];

  if (profile && profile.trim()) {
    systemParts.push("\n=== COMPLETE PORTFOLIO PROFILE ===\n", profile.trim(), "\n=== END PROFILE ===\n");
  }

  const trimmedHistory = history.slice(-MAX_HISTORY);

  return [
    { role: "system", content: systemParts.join("\n") },
    ...trimmedHistory,
    { role: "user", content: message },
  ];
}

export const sendGroqMessage = createServerFn({ method: "POST" })
  .inputValidator((data) => requestSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { reply: "Groq API key is missing on the server." };
    }

    const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
    const messages = toGroqMessages(data.profile, data.history ?? [], data.message);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    const payload = (await response.json()) as GroqResponse;
    // console.log("Groq reply:", payload.choices?.[0]?.message?.content);
    if (!response.ok) {
      return { reply: `Groq request failed (${response.status}).` };
    }
    const reply = payload.choices?.[0]?.message?.content?.trim();

    return { reply: reply || "I could not generate a response just now." };
  });
