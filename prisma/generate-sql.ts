import * as fs from 'fs'

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

const nombres = ['Carlos', 'María', 'Juan', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Valentina', 'Jorge', 'Isabella', 'Roberto', 'Camila', 'Diego', 'Daniela', 'Fernando', 'Gabriela', 'Andrés', 'Natalia', 'Ricardo', 'Paola', 'Alejandro', 'Lucía', 'Sebastián', 'Andrea', 'Gabriel', 'Mariana', 'Eduardo', 'Claudia', 'Héctor', 'Patricia', 'Oscar', 'Fernanda', 'Raúl', 'Alejandra', 'Sergio', 'Mónica', 'Arturo', 'Verónica', 'Marco', 'Beatriz', 'Pablo', 'Adriana', 'Felipe', 'Carolina', 'Javier', 'Stephanie', 'Daniel', 'Melissa']
const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Vargas', 'Castillo', 'Jiménez', 'Moreno', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Vega', 'Castro', 'Ramos', 'Núñez', 'Mendoza', 'Ruiz', 'Álvarez', 'Delgado', 'Fuentes', 'Contreras', 'Chávez', 'Carrillo', 'Guerrero', 'Luna']

const phoneCodes: Record<string, string> = {
  'México': '+52', 'Colombia': '+57', 'Argentina': '+54', 'Chile': '+56',
  'Perú': '+51', 'Ecuador': '+593', 'Venezuela': '+58', 'Guatemala': '+502',
  'Honduras': '+504', 'Panamá': '+507',
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clean(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '')
}

function escape(s: string): string {
  return s.replace(/'/g, "''")
}

const TOTAL = 2000
const inserts: string[] = []

// 200 clientes por país (10 países × 200 = 2000)
for (let p = 0; p < paises.length; p++) {
  const paisData = paises[p]
  const perPais = TOTAL / paises.length

  for (let i = 0; i < perPais; i++) {
    const nombre = rand(nombres)
    const apellido = rand(apellidos)
    const city = rand(paisData.cities)
    const segment = Math.random() > 0.5 ? 'online' : 'fisico'
    const status = Math.random() > 0.1 ? 'activo' : 'inactivo'
    const email = `${clean(nombre)}.${clean(apellido)}${p * perPais + i + 1111}@${rand(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'])}`
    const phone = `${phoneCodes[paisData.country]} ${randInt(100, 999)} ${randInt(100, 999)} ${randInt(1000, 9999)}`
    const fullName = `${nombre} ${apellido}`

    inserts.push(
      `('${escape(fullName)}', '${email}', '${phone}', '${escape(city)}', '${escape(paisData.country)}', '${segment}', '${status}')`
    )
  }
}

// Generar el SQL en lotes de 100
const lines: string[] = []
lines.push('-- Script generado automáticamente — 2,000 clientes NovaRetail')
lines.push('-- Insertado por: Roberto Farmuelles')
lines.push('')

const BATCH = 100
for (let i = 0; i < inserts.length; i += BATCH) {
  const batch = inserts.slice(i, i + BATCH)
  lines.push(`INSERT INTO public."Customers" ("fullName", email, phone, city, country, segment, status)`)
  lines.push(`VALUES`)
  lines.push(batch.join(',\n') + ';')
  lines.push('')
}

lines.push(`-- Total: ${TOTAL} clientes insertados`)

const sql = lines.join('\n')
fs.writeFileSync('prisma/clientes-roberto.sql', sql)
console.log(`✅ Archivo generado: prisma/clientes-roberto.sql`)
console.log(`✅ ${TOTAL} clientes listos para insertar en Supabase`)
