import { Frequency, ClientScore } from '@/types'

export function calculateScore(frequency: Frequency, lastPurchase: number): ClientScore {
  let score = 50

  if (frequency === 'HIGH') score += 30
  if (lastPurchase <= 10) score += 20

  score = Math.min(score, 100)

  if (score >= 80) {
    return {
      score,
      label: 'Activo',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
    }
  } else if (score >= 60) {
    return {
      score,
      label: 'En riesgo',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
    }
  } else {
    return {
      score,
      label: 'Perdido',
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
    }
  }
}