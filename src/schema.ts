import { makeExecutableSchema } from '@graphql-tools/schema'
import { Link, Comment } from '@prisma/client'
import { GraphQLContext } from './context'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { GraphQLError } from 'graphql'

const typeDefs = /* GraphQL */ `
  type Link {
    id: ID!
    desc: String!
    url: String!
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    body: String!
    linkId: ID!
    link: Link
  }

  type Query {
    info: String!
    links: [Link!]!
    link(id: ID!): Link!
    comments: [Comment!]!
    getCommentsByLinkId(linkId: ID!): [Comment!]
  }
  scalar File
  type Mutation {
    postLink(desc: String!, url: String!): Link!
    postCommentOnLink(linkId: ID!, body: String!): Comment!
    uploadFileList(fileList: [File!]!): String!
  }
`
// declare scalar File to allow upload file

const resolvers = {
  Link: {
    id: ({ id }: Link) => id,
    desc: ({ desc }: Link) => desc,
    url: ({ url }: Link) => url,
  },
  Comment: {
    id: ({ id }: Comment) => id,
    body: ({ body }: Comment) => body,
    linkId: ({ linkId }: Comment) => linkId,
  },
  Query: {
    info: () => 'This is an amazing framework!',
    links: (parent: unknown, {}: any, { prisma }: GraphQLContext) => {
      return prisma.link.findMany()
    },
    comments: (parent: unknown, {}: any, { prisma }: GraphQLContext) => {
      return prisma.comment.findMany()
    },
    link: (
      parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ) => {
      return prisma.link.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
      })
    },
    getCommentsByLinkId: (
      parent: unknown,
      { linkId }: any,
      { prisma }: GraphQLContext
    ) => {
      return prisma.comment.findMany({
        where: {
          linkId: parseInt(linkId),
          // skip count of record pages
          // skip,
          // take count of records
          // take
        },
      })
    },
  },
  Mutation: {
    postLink: async (
      parent: unknown,
      { desc, url }: { desc: string; url: string },
      { prisma }: GraphQLContext
    ) => {
      const newLink = await prisma.link.create({
        data: {
          url,
          desc,
        },
      })
      return newLink
    },
    postCommentOnLink: async (
      parent: unknown,
      { linkId, body }: { linkId: string; body: string },
      { prisma }: GraphQLContext
    ) => {
      const comment = await prisma.comment
        .create({
          data: {
            linkId: parseInt(linkId),
            body,
          },
        })
        // error handle
        .catch((err: unknown) => {
          if (
            err instanceof PrismaClientKnownRequestError &&
            // @see https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
            err.code === 'P2003'
          ) {
            return Promise.reject(
              new GraphQLError(
                `Cannot post comment on non-existing link with id ${linkId}`
              )
            )
          }
        })
      return comment
    },
    uploadFileList: async (_: unknown, { fileList }: { fileList: File[] }) => {
      console.log('fileList :>> ', fileList)
      return 'fileList'
    },
  },
}

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
})
