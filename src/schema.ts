import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    postLink(url: String!, desc: String!): Link!
  }

  type Link {
    id: ID!
    desc: String!
    url: String!
  }
`

type Link = {
  id: string
  url: string
  desc: string
}

const links: Link[] = [
  {
    id: '1',
    url: '111https://graphql-yoga.com',
    desc: '111The easiest way of setting up a GraphQL server',
  },
  {
    id: '2',
    url: '222https://graphql-yoga.com',
    desc: '222The easiest way of setting up a GraphQL server',
  },
]

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    info: () => `This is the API`,
    feed: () => links,
  },
  Mutation: {
    postLink: (
      parent: unknown,
      { desc, url }: { desc: string; url: string }
    ) => {
      let id = links.length
      const link: Link = {
        id: `${id}`,
        desc,
        url,
      }
      links.push(link)
      console.log('links :>> ', links)
      return link
    },
  },
  // Link: {
  //   id: ({ id }: Link) => id,
  //   desc: ({ desc }: Link) => desc,
  //   url: ({ url }: Link) => url,
  // },
}

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
})
