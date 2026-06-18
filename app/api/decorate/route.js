export const maxDuration = 60

export async function POST(request) {
  try {
    const { style } = await request.json()

    const prompts = {
      modern: "modern living room interior design clean lines grey sofa LED lighting",
      classic: "classic elegant living room burgundy sofa crystal chandelier luxury",
      minimalist: "minimalist living room white walls simple furniture scandinavian",
      bohemian: "bohemian living room colorful cushions rattan furniture fairy lights plants"
    }

    const prompt = encodeURIComponent(prompts[style] || prompts.modern)
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true`

    return Response.json({
      success: true,
      image: imageUrl
    })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}