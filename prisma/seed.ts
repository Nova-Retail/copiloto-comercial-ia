import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  console.log('🌱 Seeding NovaRetail database...')

  await prisma.aiRecommendation.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.profile.deleteMany()

  // Categorías
  const categorias = await Promise.all([
    prisma.category.create({ data: { name: 'Laptops', description: 'Computadoras portátiles' } }),
    prisma.category.create({ data: { name: 'Celulares', description: 'Teléfonos inteligentes' } }),
    prisma.category.create({ data: { name: 'Monitores', description: 'Pantallas y monitores' } }),
    prisma.category.create({ data: { name: 'Audio', description: 'Audífonos y bocinas' } }),
    prisma.category.create({ data: { name: 'Periféricos', description: 'Teclados, mouse y accesorios' } }),
    prisma.category.create({ data: { name: 'Almacenamiento', description: 'SSD, HDD y memorias' } }),
    prisma.category.create({ data: { name: 'Tablets', description: 'Tabletas digitales' } }),
    prisma.category.create({ data: { name: 'Gaming', description: 'Productos para gaming' } }),
  ])
  console.log(`✅ ${categorias.length} categorías creadas`)

  const catMap = Object.fromEntries(categorias.map(c => [c.name, c.id]))

  // Productos
  const productos = await Promise.all([
    prisma.product.create({ data: { name: 'Laptop ProBook 15', categoryId: catMap['Laptops'], price: 1299.99, stock: 45, rating: 4.5 } }),
    prisma.product.create({ data: { name: 'Monitor Gamer 27"', categoryId: catMap['Monitores'], price: 349.99, stock: 30, rating: 4.7 } }),
    prisma.product.create({ data: { name: 'Teclado Mecánico RGB', categoryId: catMap['Periféricos'], price: 89.99, stock: 120, rating: 4.3 } }),
    prisma.product.create({ data: { name: 'Mouse Inalámbrico Pro', categoryId: catMap['Periféricos'], price: 59.99, stock: 200, rating: 4.6 } }),
    prisma.product.create({ data: { name: 'Audífonos Noise Cancel', categoryId: catMap['Audio'], price: 199.99, stock: 60, rating: 4.8 } }),
    prisma.product.create({ data: { name: 'Tablet 10" HD', categoryId: catMap['Tablets'], price: 499.99, stock: 25, rating: 4.2 } }),
    prisma.product.create({ data: { name: 'SSD 1TB NVMe', categoryId: catMap['Almacenamiento'], price: 129.99, stock: 80, rating: 4.9 } }),
    prisma.product.create({ data: { name: 'Cámara Web 4K', categoryId: catMap['Periféricos'], price: 149.99, stock: 40, rating: 4.4 } }),
  ])
  console.log(`✅ ${productos.length} productos creados`)

  // Perfiles
  const vendedor1 = await prisma.profile.create({ data: { fullName: 'Roberto Farmuelles', role: 'admin' } })
  const vendedor2 = await prisma.profile.create({ data: { fullName: 'María González', role: 'vendedor' } })
  console.log('✅ Perfiles creados')

  // Clientes
  const clientes = await Promise.all([
    prisma.customer.create({ data: { fullName: 'Carlos García', email: 'carlos.garcia@techcorp.mx', phone: '+52 55 1234 5678', city: 'Ciudad de México', country: 'México', segment: 'online', frequency: 'HIGH', lastPurchase: 5, interest: 'Software empresarial ERP', status: 'activo' } }),
    prisma.customer.create({ data: { fullName: 'María López', email: 'maria.lopez@innovate.mx', phone: '+52 33 9876 5432', city: 'Guadalajara', country: 'México', segment: 'online', frequency: 'MEDIUM', lastPurchase: 25, interest: 'Automatización de procesos', status: 'activo' } }),
    prisma.customer.create({ data: { fullName: 'Andrés Martínez', email: 'andres.m@startup.io', phone: '+52 81 4567 8901', city: 'Monterrey', country: 'México', segment: 'fisico', frequency: 'LOW', lastPurchase: 60, interest: 'Marketing digital', status: 'activo' } }),
    prisma.customer.create({ data: { fullName: 'Lucía Fernández', email: 'lucia.f@ecommerce.com', phone: '+507 6123 4567', city: 'Ciudad de Panamá', country: 'Panamá', segment: 'online', frequency: 'HIGH', lastPurchase: 3, interest: 'E-commerce y ventas B2B', status: 'activo' } }),
    prisma.customer.create({ data: { fullName: 'Roberto Silva', email: 'r.silva@consulting.net', phone: '+57 300 123 4567', city: 'Bogotá', country: 'Colombia', segment: 'fisico', frequency: 'MEDIUM', lastPurchase: 45, interest: 'Consultoría empresarial', status: 'activo' } }),
    prisma.customer.create({ data: { fullName: 'Patricia Vega', email: 'pvega@manufacturamexico.com', phone: '+52 55 8765 4321', city: 'Puebla', country: 'México', segment: 'fisico', frequency: 'LOW', lastPurchase: 90, interest: 'Manufactura y logística', status: 'inactivo' } }),
    prisma.customer.create({ data: { fullName: 'Diego Romero', email: 'diego.r@fintech.mx', phone: '+52 55 2345 6789', city: 'Ciudad de México', country: 'México', segment: 'online', frequency: 'HIGH', lastPurchase: 8, interest: 'Fintech y pagos digitales', status: 'activo' } }),
  ])
  console.log(`✅ ${clientes.length} clientes creados`)

  // Órdenes
  const ordenes = await Promise.all([
    prisma.order.create({ data: { customerId: clientes[0].id, totalAmount: 1299.99, status: 'completada', salesUserId: vendedor1.id } }),
    prisma.order.create({ data: { customerId: clientes[0].id, totalAmount: 349.99, status: 'completada', salesUserId: vendedor1.id } }),
    prisma.order.create({ data: { customerId: clientes[3].id, totalAmount: 589.98, status: 'completada', salesUserId: vendedor2.id } }),
    prisma.order.create({ data: { customerId: clientes[6].id, totalAmount: 199.99, status: 'completada', salesUserId: vendedor1.id } }),
    prisma.order.create({ data: { customerId: clientes[1].id, totalAmount: 129.99, status: 'completada', salesUserId: vendedor2.id } }),
  ])

  await Promise.all([
    prisma.orderItem.create({ data: { orderId: ordenes[0].id, productId: productos[0].id, quantity: 1, unitPrice: 1299.99 } }),
    prisma.orderItem.create({ data: { orderId: ordenes[1].id, productId: productos[1].id, quantity: 1, unitPrice: 349.99 } }),
    prisma.orderItem.create({ data: { orderId: ordenes[2].id, productId: productos[2].id, quantity: 2, unitPrice: 89.99 } }),
    prisma.orderItem.create({ data: { orderId: ordenes[3].id, productId: productos[4].id, quantity: 1, unitPrice: 199.99 } }),
    prisma.orderItem.create({ data: { orderId: ordenes[4].id, productId: productos[6].id, quantity: 1, unitPrice: 129.99 } }),
  ])
  console.log('✅ Órdenes creadas')

  // Oportunidades
  await Promise.all([
    prisma.opportunity.create({ data: { customerId: clientes[0].id, assignedUserId: vendedor1.id, estimatedValue: 5000, stage: 'propuesta_enviada', priority: 'Alta', notes: 'Interesado en suite completa de software ERP' } }),
    prisma.opportunity.create({ data: { customerId: clientes[1].id, assignedUserId: vendedor2.id, estimatedValue: 2500, stage: 'seguimiento', priority: 'Media', notes: 'Evaluar solución de automatización' } }),
    prisma.opportunity.create({ data: { customerId: clientes[3].id, assignedUserId: vendedor1.id, estimatedValue: 8000, stage: 'nueva', priority: 'Alta', notes: 'Potencial cliente para expansión B2B' } }),
    prisma.opportunity.create({ data: { customerId: clientes[6].id, assignedUserId: vendedor1.id, estimatedValue: 12000, stage: 'propuesta_enviada', priority: 'Alta', notes: 'Integración de pagos digitales' } }),
  ])
  console.log('✅ Oportunidades creadas')

  console.log('\n🎉 Seed completado — NovaRetail listo!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
