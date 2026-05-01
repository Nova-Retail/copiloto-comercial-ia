export type Frequency = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Client {
  id: string
  name: string
  email: string
  frequency: Frequency
  lastPurchase: number
  interest: string
  createdAt: string | Date
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
