import { PrismaClient, Frequency } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

// =====================================================
// DATOS DE REFERENCIA
// =====================================================

const paises = [
  { country: 'México', cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Mérida', 'Cancún', 'Querétaro', 'Toluca'] },
  { country: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Cúcuta'] },
  { country: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'] },
  { country: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Viña del Mar', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique'] },
  { country: 'Perú', cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Huancayo', 'Iquitos', 'Tacna', 'Pucallpa'] },
  { country: 'Ecuador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Portoviejo', 'Machala', 'Loja', 'Esmeraldas', 'Riobamba'] },
  { country: 'Venezuela', cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Mérida', 'Barcelona', 'Maturín', 'Cabimas', 'Coro'] },
  { country: 'Guatemala', cities: ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'Chimaltenango', 'Cobán', 'Huehuetenango', 'Petapa', 'Amatitlán'] },
  { country: 'Honduras', cities: ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Juticalpa', 'Danlí', 'Siguatepeque'] },
  { country: 'Panamá', cities: ['Ciudad de Panamá', 'San Miguelito', 'Tocumen', 'David', 'Arraiján', 'Colón', 'La Chorrera', 'Santiago', 'Chitré', 'Aguadulce'] },
]

const nombres = [
  'Carlos', 'María', 'Juan', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Valentina',
  'Jorge', 'Isabella', 'Roberto', 'Camila', 'Diego', 'Daniela', 'Fernando', 'Gabriela', 'Andrés', 'Natalia',
  'Ricardo', 'Paola', 'Alejandro', 'Lucía', 'Sebastián', 'Andrea', 'Gabriel', 'Mariana', 'Eduardo', 'Claudia',
  'Héctor', 'Patricia', 'Oscar', 'Fernanda', 'Raúl', 'Alejandra', 'Sergio', 'Mónica', 'Arturo', 'Verónica',
  'Marco', 'Beatriz', 'Pablo', 'Adriana', 'Felipe', 'Carolina', 'Javier', 'Stephanie', 'Daniel', 'Melissa',
]

const apellidos = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
  'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Vargas', 'Castillo',
  'Jiménez', 'Moreno', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Vega', 'Castro', 'Ramos', 'Núñez',
  'Mendoza', 'Ruiz', 'Álvarez', 'Delgado', 'Fuentes', 'Contreras', 'Chávez', 'Carrillo', 'Guerrero', 'Luna',
]

const intereses = [
  'Software empresarial ERP', 'Automatización de procesos', 'Marketing digital', 'E-commerce y ventas B2B',
  'Consultoría empresarial', 'Manufactura y logística', 'Fintech y pagos digitales', 'Ciberseguridad',
  'Inteligencia artificial', 'Cloud computing', 'Desarrollo web', 'Aplicaciones móviles',
  'Gestión de inventarios', 'CRM y ventas', 'Recursos humanos', 'Contabilidad y finanzas',
  'Educación online', 'Salud digital', 'Turismo y hospitalidad', 'Retail omnicanal',
]

const productos = [
  { name: 'Laptop ProBook 15', price: 1299.99 },
  { name: 'Monitor Gamer 27"', price: 349.99 },
  { name: 'Teclado Mecánico RGB', price: 89.99 },
  { name: 'Mouse Inalámbrico Pro', price: 59.99 },
  { name: 'Audífonos Noise Cancel', price: 199.99 },
  { name: 'Tablet 10" HD', price: 499.99 },
  { name: 'SSD 1TB NVMe', price: 129.99 },
  { name: 'Cámara Web 4K', price: 149.99 },
]

// =====================================================
// FUNCIONES UTILITARIAS
// =====================================================

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randDate(daysAgo: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - randInt(0, daysAgo))
  return date
}

function generateEmail(name: string, lastName: string, index: number): string {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'empresa.com', 'corp.net']
  const clean = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '')
  return `${clean(name)}.${clean(lastName)}${index}@${rand(domains)}`
}

function generatePhone(country: string): string {
  const codes: Record<string, string> = {
    'México': '+52', 'Colombia': '+57', 'Argentina': '+54', 'Chile': '+56',
    'Perú': '+51', 'Ecuador': '+593', 'Venezuela': '+58', 'Guatemala': '+502',
    'Honduras': '+504', 'Panamá': '+507',
  }
  const code = codes[country] || '+1'
  return `${code} ${randInt(100, 999)} ${randInt(100, 999)} ${randInt(1000, 9999)}`
}

function getFrequency(orderCount: number): Frequency {
  if (orderCount >= 8) return Frequency.HIGH
  if (orderCount >= 4) return Frequency.MEDIUM
  return Frequency.LOW
}

// =====================================================
// SEED PRINCIPAL
// =====================================================

async function main() {
  console.log('🌱 Iniciando seed masivo NovaRetail — 2,000 clientes...')
  console.log('⚠️  Limpiando datos existentes...')

  await prisma.aiRecommendation.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.profile.deleteMany()

  // Crear productos
  const dbProducts = await Promise.all(
    productos.map(p => prisma.product.create({
      data: {
        name: p.name,
        category: 'Electrónica',
        price: p.price,
        stock: randInt(10, 200),
        rating: parseFloat((randInt(35, 50) / 10).toFixed(1))
      }
    }))
  )
  console.log(`✅ ${dbProducts.length} productos creados`)

  // Crear perfiles vendedores
  const vendedores = await Promise.all([
    prisma.profile.create({ data: { fullName: 'Roberto Farmuelles', role: 'admin' } }),
    prisma.profile.create({ data: { fullName: 'María González', role: 'gerente' } }),
    prisma.profile.create({ data: { fullName: 'Carlos Méndez', role: 'vendedor' } }),
    prisma.profile.create({ data: { fullName: 'Ana Rodríguez', role: 'vendedor' } }),
    prisma.profile.create({ data: { fullName: 'Luis Herrera', role: 'vendedor' } }),
  ])
  console.log(`✅ ${vendedores.length} vendedores creados`)

  // Generar 2,000 clientes en lotes de 100
  const TOTAL = 2000
  const BATCH = 100
  let created = 0

  for (let batch = 0; batch < TOTAL / BATCH; batch++) {
    const customersBatch = []

    for (let i = 0; i < BATCH; i++) {
      const index = batch * BATCH + i
      const nombre = rand(nombres)
      const apellido = rand(apellidos)
      const paisData = rand(paises)
      const city = rand(paisData.cities)
      const orderCount = randInt(1, 15)
      const lastOrderDays = randInt(1, 120)

      customersBatch.push({
        fullName: `${nombre} ${apellido}`,
        email: generateEmail(nombre, apellido, index),
        phone: generatePhone(paisData.country),
        city,
        country: paisData.country,
        segment: Math.random() > 0.5 ? 'online' : 'fisico',
        status: Math.random() > 0.1 ? 'activo' : 'inactivo',
        interest: rand(intereses),
        frequency: getFrequency(orderCount),
        lastPurchase: lastOrderDays,
      })
    }

    const createdCustomers = await Promise.all(
      customersBatch.map(c => prisma.customer.create({ data: c }))
    )

    // Crear órdenes para cada cliente del lote
    for (const customer of createdCustomers) {
      const orderCount = randInt(1, 15)
      for (let o = 0; o < orderCount; o++) {
        const product = rand(dbProducts)
        const quantity = randInt(1, 3)
        const unitPrice = Number(product.price)
        const total = unitPrice * quantity

        const order = await prisma.order.create({
          data: {
            customerId: customer.id,
            totalAmount: total,
            orderDate: randDate(365),
            status: rand(['completada', 'completada', 'completada', 'pendiente', 'cancelada']),
            salesUserId: rand(vendedores).id,
          }
        })

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity,
            unitPrice,
          }
        })
      }
    }

    created += BATCH
    if (created % 500 === 0) {
      console.log(`⏳ ${created}/${TOTAL} clientes procesados...`)
    }
  }

  console.log(`✅ ${TOTAL} clientes creados con sus órdenes`)
  console.log('\n🎉 Seed completado — NovaRetail listo!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
