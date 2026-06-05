export async function generateCopilotInsights(
  analysis: any
) {
  const response = await fetch(
    "/api/copilot",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        analysis
      ),
    }
  );

  return response.json();
}