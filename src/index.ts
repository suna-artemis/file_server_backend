import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { execute, parse } from 'graphql'

import { schema } from './schema'
import { createContext } from './context'

/**
 * server entrypoint
 */
const main = async () => {
  // create yoga middleware
  const yoki = createYoga({ schema, context: createContext })

  // create server include yoga
  const server = createServer(yoki)

  // listen on port 4000 and waiting some requests
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
  })
}

main()
