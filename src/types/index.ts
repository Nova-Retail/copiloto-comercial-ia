export type Frequency = 'LOW' | 'MEDIUM' | 'HIGH'
export type Role = 'admin' | 'vendedor' | 'gerente'
export type Stage = 'nueva' | 'seguimiento' | 'propuesta_enviada' | 'cerrada_ganada' | 'cerrada_perdida'
export type Priority = 'Alta' | 'Media' | 'Baja'

// Cliente principal (compatible con UI actual)
export interface Customer {
  id: number
  fullName: string
  email?: string | null
  phone?: string | null
  city?: string | null
  country?: string | null
  registrationDate: string | Date
  segment?: string | null
  status: string
  frequency: Frequency
  lastPurchase: number
  interest: string
}

// Alias para compatibilidad con componentes existentes
export type Client = Customer & { name: string }

export interface Product {
  id: number
  name: string
  category?: string | null
  price?: number | null
  stock: number
  imageUrl?: string | null
  rating?: number | null
}

export interface Order {
  id: number
  customerId: number
  totalAmount?: number | null
  orderDate: string | Date
  status: string
}

export interface Opportunity {
  id: number
  customerId: number
  estimatedValue?: number | null
  stage: Stage
  priority: Priority
  createdAt: string | Date
  notes?: string | null
}

export interface AiRecommendation {
  id: number
  customerId: number
  score?: number | null
  recommendationText?: string | null
  nextAction?: string | null
  generatedAt: string | Date
}

export interface ClientScore {
  score: number
  label: string
  color: string
  bgColor: string
}

export interface AIResponse {
  message: string
}
