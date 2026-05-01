import { PrismaClient, Frequency } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  console.log('🌱 Seeding database...')

  // Limpiar datos existentes
  await prisma.client.deleteMany()

  const clients = [
    {
      name: 'Carlos García',
      email: 'carlos.garcia@techcorp.mx',
      frequency: Frequency.HIGH,
      lastPurchase: 5,
      interest: 'Software empresarial ERP',
    },
    {
      name: 'María López',
      email: 'maria.lopez@innovate.mx',
      frequency: Frequency.MEDIUM,
      lastPurchase: 25,
      interest: 'Automatización de procesos',
    },
    {
      name: 'Andrés Martínez',
      email: 'andres.m@startup.io',
      frequency: Frequency.LOW,
      lastPurchase: 60,
      interest: 'Marketing digital',
    },
    {
      name: 'Lucía Fernández',
      email: 'lucia.f@ecommerce.com',
      frequency: Frequency.HIGH,
      lastPurchase: 3,
      interest: 'E-commerce y ventas B2B',
    },
    {
      name: 'Roberto Silva',
      email: 'r.silva@consulting.net',
      frequency: Frequency.MEDIUM,
      lastPurchase: 45,
      interest: 'Consultoría empresarial',
    },
    {
      name: 'Patricia Vega',
      email: 'pvega@manufacturamexico.com',
      frequency: Frequency.LOW,
      lastPurchase: 90,
      interest: 'Manufactura y logística',
    },
    {
      name: 'Diego Romero',
      email: 'diego.r@fintech.mx',
      frequency: Frequency.HIGH,
      lastPurchase: 8,
      interest: 'Fintech y pagos digitales',
    },
  ]

  for (const client of clients) {
    await prisma.client.create({ data: client })
    console.log(`✅ ${client.name}`)
  }

  console.log('\n🎉 Seed completado — 7 clientes creados en Supabase')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
