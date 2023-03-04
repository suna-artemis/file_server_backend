import { execute, parse } from 'graphql'
import { schema } from './schema'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
/**
 * server entrypoint
 */
const main = async () => {
  // create yoga middleware
  const yoki = createYoga({ schema })

  // create server include yoga
  const server = createServer(yoki)

  // listen on port 4000 and waiting some requests
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql/')
  })
}

main()
