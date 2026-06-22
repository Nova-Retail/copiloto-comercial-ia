import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

export async function POST(req: Request) {
  try {
    const customerData = await req.json();
    const client = getClient();

    if (!client) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY no configurada" },
        { status: 503 }
      );
    }

    const prompt = `
Eres un copiloto comercial experto en ventas.

Analiza este cliente:

${JSON.stringify(customerData, null, 2)}

Genera:

1. Resumen ejecutivo.
2. Riesgos y oportunidades.
3. Recomendación comercial.
4. Mensaje WhatsApp.
5. Email comercial.

Responde unicamente con JSON valido.

No uses markdown.
No uses \`\`\`json.
No agregues explicaciones.
No agregues texto antes o despues del JSON.
El JSON debe ser parseable por JSON.parse().

Formato de respuesta:
{
  "summary":"",
  "recommendation":"",
  "whatsapp":"",
  "email":""
}
`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    // Limpiar posibles backticks o texto extra que el modelo pudiera agregar
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(cleaned || "{}"));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Copilot failed" },
      { status: 500 }
    );
  }
}
