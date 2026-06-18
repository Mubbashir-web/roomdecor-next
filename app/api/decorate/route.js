export const maxDuration = 60

export async function POST(request) {
  try {
    const { style } = await request.json()

    const prompts = {
      modern: "modern living room interior design, clean lines, grey sofa, photorealistic",
      classic: "classic elegant living room, burgundy sofa, chandelier, photorealistic",
      minimalist: "minimalist living room, white walls, simple furniture, photorealistic",
      bohemian: "bohemian living room, colorful cushions, rattan furniture, photorealistic"
    }

    const prompt = prompts[style] || prompts.modern

    // Pehle model ko warm karo
    let attempts = 0
    let imageBuffer = null

    while (attempts < 3) {
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
              wait_for_model: true,
              use_cache: false
            }
          })
        }
      )

      if (response.ok) {
        imageBuffer = await response.arrayBuffer()
        break
      }

      const errorText = await response.text()
      
      // Agar model loading ho toh wait karo
      if (errorText.includes('loading') || response.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 10000))
        attempts++
        continue
      }

      return Response.json({ error: errorText }, { status: 500 })
    }

    if (!imageBuffer) {
      return Response.json({ error: 'Model timeout — try again!' }, { status: 500 })
    }

    const base64Image = Buffer.from(imageBuffer).toString('base64')

    return Response.json({
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`
    })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}