import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai'
import { Client } from '@/types'
import { calculateScore } from '@/lib/scoring'

function generateMockMessage(client: Client): string {
  const { score, label } = calculateScore(client.frequency, client.lastPurchase)

  const templates: Record<string, string> = {
    HIGH: `🎯 Análisis de ${client.name} — Score ${score}/100 (${label})

**Recomendación estratégica:**
Este cliente tiene alta frecuencia de compra y actividad reciente, lo que lo convierte en candidato ideal para una propuesta de upsell o programa de lealtad. Es el momento de consolidar la relación y expandir el ticket promedio.

**Mensaje comercial listo para enviar:**
"Hola ${client.name}, valoramos mucho tu confianza constante con nosotros. Dado tu nivel de actividad en ${client.interest}, hemos preparado una propuesta exclusiva que podría amplificar significativamente tus resultados actuales. ¿Tienes 20 minutos esta semana para una llamada estratégica?"`,

    MEDIUM: `📊 Análisis de ${client.name} — Score ${score}/100 (${label})

**Recomendación estratégica:**
Cliente con potencial de crecimiento. Una propuesta de valor bien estructurada puede convertirlo en comprador recurrente de alto valor. Prioriza demostrar ROI concreto en su área de interés.

**Mensaje comercial listo para enviar:**
"Hola ${client.name}, hemos desarrollado nuevas soluciones específicas para empresas que trabajan en ${client.interest}. Basándonos en tu historial, creemos que podemos mejorar notablemente tus resultados actuales. ¿Te gustaría conocer los detalles en una demo de 30 minutos?"`,

    LOW: `❄️ Análisis de ${client.name} — Score ${score}/100 (${label})

**Recomendación estratégica:**
Cliente inactivo que requiere una estrategia de reactivación. Ofrece valor inmediato y sin fricción: una consulta gratuita, contenido relevante o una oferta especial por tiempo limitado puede restablecer el contacto.

**Mensaje comercial listo para enviar:**
"Hola ${client.name}, ha pasado un tiempo desde nuestra última conversación y queríamos reconectarnos. Tenemos novedades muy relevantes para tu área de ${client.interest}. Te reservamos una sesión de consulta gratuita de 30 minutos — sin compromiso. ¿Te interesa agendar?"`,
  }

  return templates[client.frequency] ?? templates.MEDIUM
}

export async function POST(request: NextRequest) {
  const client: Client = await request.json()
  const openai = getOpenAIClient()

  if (!openai) {
    return NextResponse.json({ message: generateMockMessage(client) })
  }

  try {
    const { score, label } = calculateScore(client.frequency, client.lastPurchase)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un copiloto comercial IA experto en ventas B2B. Generas recomendaciones estratégicas y mensajes comerciales persuasivos en español. Responde siempre con: 1) Recomendación estratégica (2-3 oraciones), 2) Mensaje comercial listo para enviar (tono profesional y persuasivo). Usa formato claro con títulos.',
        },
        {
          role: 'user',
          content: `Analiza este cliente y genera una recomendación comercial personalizada:

Nombre: ${client.name}
Email: ${client.email}
Frecuencia de compra: ${client.frequency}
Días desde última compra: ${client.lastPurchase}
Área de interés: ${client.interest}
Score calculado: ${score}/100 (${label})`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      message: completion.choices[0].message.content ?? generateMockMessage(client),
    })
  } catch {
    return NextResponse.json({ message: generateMockMessage(client) })
  }
}
