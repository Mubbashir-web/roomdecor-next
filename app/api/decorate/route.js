export const maxDuration = 60

export async function POST(request) {
  try {
    const { style } = await request.json()

    const prompts = {
      modern: "a modern living room interior design, clean lines, grey sofa, LED lighting, minimalist decor, high quality, photorealistic",
      classic: "a classic elegant living room interior, burgundy velvet sofa, crystal chandelier, ornate gold frames, luxury decor, photorealistic",
      minimalist: "a minimalist living room, white walls, simple furniture, clean space, natural light, scandinavian design, photorealistic",
      bohemian: "a bohemian living room, colorful cushions, rattan furniture, fairy lights, plants, eclectic decor, warm colors, photorealistic"
    }

    const prompt = prompts[style] || prompts.modern

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true
          }
        }),
        signal: AbortSignal.timeout(55000)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return Response.json({ error: error }, { status: 500 })
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    return Response.json({
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`
    })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}