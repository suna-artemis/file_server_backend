import { createServer } from 'http'
import { createYoga, useLogger } from 'graphql-yoga'

import { schema } from './schema'
import { createContext } from './context'

/**
 * server entrypoint
 */
const main = async () => {
  // create yoga middleware
  const yoki = createYoga({
    schema,
    graphqlEndpoint: '/api/v1',
    context: createContext,
  })

  // create server include yoga
  const server = createServer(yoki)

  // listen on port 4000 and waiting some requests
  server.listen(10000, () => {
    console.info('Server is running on http://localhost:10000/api/v1')
  })
}

main()
