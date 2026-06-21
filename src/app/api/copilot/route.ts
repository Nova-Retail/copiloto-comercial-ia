import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const customerData = await req.json();

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

Responde únicamente con JSON válido.

No uses markdown.
No uses \`\`\`json.
No agregues explicaciones.
No agregues texto antes o después del JSON.
El JSON debe ser parseable por JSON.parse().

Formato de respuesta:
{
  "summary":"",
  "recommendation":"",
  "whatsapp":"",
  "email":""
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content =
      response.choices[0].message.content;

    return NextResponse.json(
      JSON.parse(content || "{}")
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Copilot failed" },
      { status: 500 }
    );
  }
}