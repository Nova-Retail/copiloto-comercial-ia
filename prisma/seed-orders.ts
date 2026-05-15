import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

const productos = [
  { name: 'MacBook Pro 14" M3', price: 1999.99 },
  { name: 'iPhone 15 Pro Max', price: 1199.99 },
  { name: 'Samsung Galaxy S24 Ultra', price: 1299.99 },
  { name: 'Dell XPS 13 Plus', price: 1299.99 },
  { name: 'Monitor Gamer 27"', price: 349.99 },
  { name: 'Teclado Mecánico RGB', price: 89.99 },
  { name: 'Mouse Inalámbrico Pro', price: 59.99 },
  { name: 'Audífonos Noise Cancel', price: 199.99 },
  { name: 'SSD 1TB NVMe', price: 129.99 },
  { name: 'Tablet 10" Android', price: 199.99 },
]

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randDate(daysAgo: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - randInt(0, daysAgo))
  return date
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🌱 Generando órdenes para clientes existentes...')

  // Obtener todos los clientes existentes
  const customers = await prisma.customer.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  })
  console.log(`✅ ${customers.length} clientes encontrados`)

  // Obtener productos existentes
  const dbProducts = await prisma.product.findMany({
    select: { id: true, price: true },
  })

  // Si no hay productos en la BD usar los de referencia como datos ficticios
  const productList = dbProducts.length > 0 ? dbProducts : []
  console.log(`✅ ${productList.length} productos encontrados`)

  // Obtener vendedores
  const vendedores = await prisma.profile.findMany({
    select: { id: true },
  })
  console.log(`✅ ${vendedores.length} vendedores encontrados`)

  if (vendedores.length === 0) {
    console.log('⚠️  No hay vendedores — creando uno por defecto...')
    const vendedor = await prisma.profile.create({
      data: { fullName: 'Vendedor Default', role: 'vendedor' }
    })
    vendedores.push({ id: vendedor.id })
  }

  let totalOrdenes = 0
  let processed = 0

  for (const customer of customers) {
    const orderCount = randInt(3, 12)

    for (let o = 0; o < orderCount; o++) {
      const quantity = randInt(1, 3)
      const precio = productList.length > 0
        ? Number(rand(productList).price ?? 99.99)
        : productos[randInt(0, productos.length - 1)].price
      const total = precio * quantity
      const orderDate = randDate(365)

      try {
        const order = await prisma.order.create({
          data: {
            customerId: customer.id,
            totalAmount: total,
            orderDate,
            status: rand(['completada', 'completada', 'completada', 'pendiente', 'cancelada']),
            salesUserId: rand(vendedores).id,
          }
        })

        if (productList.length > 0) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: rand(productList).id,
              quantity,
              unitPrice: precio,
            }
          })
        }

        totalOrdenes++
      } catch {
        // continúa si falla una orden
      }
    }

    processed++
    if (processed % 100 === 0) {
      console.log(`⏳ ${processed}/${customers.length} clientes procesados — ${totalOrdenes} órdenes creadas`)
      await sleep(1000)
    }
  }

  console.log(`\n✅ ${totalOrdenes} órdenes creadas para ${customers.length} clientes`)

  // Actualizar frequency y lastPurchase basado en órdenes reales
  console.log('\n🔄 Actualizando frequency y lastPurchase desde órdenes reales...')

  await prisma.$executeRaw`
    UPDATE public."Customers" c
    SET 
      "lastPurchase" = COALESCE(
        (SELECT EXTRACT(DAY FROM NOW() - MAX(o."orderDate"))::INTEGER
         FROM public."Orders" o WHERE o."customerId" = c.id),
        30
      ),
      frequency = CASE 
        WHEN (SELECT COUNT(*) FROM public."Orders" o WHERE o."customerId" = c.id) >= 8 THEN 'HIGH'
        WHEN (SELECT COUNT(*) FROM public."Orders" o WHERE o."customerId" = c.id) >= 4 THEN 'MEDIUM'
        ELSE 'LOW'
      END
  `

  console.log('✅ frequency y lastPurchase actualizados')
  console.log('\n🎉 Seed de órdenes completado!')
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
