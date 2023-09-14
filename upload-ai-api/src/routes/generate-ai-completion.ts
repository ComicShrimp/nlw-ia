import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"
import { streamToResponse, OpenAIStream } from 'ai'
import { openai } from "../lib/openai"

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (request, response) => {

    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })
    
    const { template, videoId, temperature } = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })

    if (!video.transcript) {
      return response.status(400).send({
        error: 'Video transcript was not generated yet',
      })
    }

    const promptMessage = template.replace('{trascription}', video.transcript)

    const reply = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        { role: 'user', content: promptMessage }
      ],
      stream: true,
    })

    const stream = OpenAIStream(reply)

    streamToResponse(stream, response.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }
    })

  }
  )
}