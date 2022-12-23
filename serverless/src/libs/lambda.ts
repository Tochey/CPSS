import middy from "@middy/core"
import eventNormalizer from "@middy/event-normalizer"
import middyJsonBodyParser from "@middy/http-json-body-parser"

export const middyfy = (handler : any) => {
  return middy(handler).use(middyJsonBodyParser())
}

export const eventify = (handler : any) => {
  return middy(handler).use(eventNormalizer())
}
