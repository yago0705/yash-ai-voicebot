import { PERSONA } from "@/lib/persona";

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: PERSONA,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return Response.json({
    answer: data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.",
  });
}