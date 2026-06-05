const API_URL =
  process.env.NEXT_PUBLIC_COPILOT_API_URL

export async function analyzeCustomer(
  customerId: number
) {
  console.log(
  "Analyzing customer:",
  customerId
)
  const response = await fetch(
    `${API_URL}/analysis/customer/full`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_id: customerId
      })
    }
  )

  if (!response.ok) {
    throw new Error(
      'Error analyzing customer'
    )
  }

  return response.json()
}