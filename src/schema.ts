import { makeExecutableSchema } from '@graphql-tools/schema'
import { Link, Comment } from '@prisma/client'
import { GraphQLContext } from './context'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { GraphQLError } from 'graphql'
import * as fsp from 'fs/promises'

const STATIC_ROOT_PATH = './static'

enum FileInfoType {
  FILE = 'file',
  DIRECTORY = 'directory',
  // like socket, link, fifo pipe,
  OTHER = 'other',
}

interface FileInfo {
  name: string
  type: FileInfoType
}

const typeDefs = /* GraphQL */ `
  scalar File
  type FileInfo {
    name: String!
    type: String!
  }
  type Query {
    info: String!
    FileInfo: FileInfo!
    parentDirectory(parentDirectory: String!): String!
    getFileListByParentDirectory(parentDirectory: String!): [FileInfo!]!
  }
  type Mutation {
    uploadFileList(fileList: [File!]!): String!
  }
`
const resolvers = {
  Query: {
    info: () => 'This is an amazing framework!',
    getFileListByParentDirectory: async (
      _: unknown,
      { parentDirectory }: { parentDirectory: string }
    ): Promise<FileInfo[]> => {
      const res = await fsp.readdir(`${STATIC_ROOT_PATH}${parentDirectory}`, {
        withFileTypes: true,
      })
      return res.map((file) => ({
        name: file.name,
        type: file.isFile()
          ? FileInfoType.FILE
          : file.isDirectory()
          ? FileInfoType.DIRECTORY
          : FileInfoType.OTHER,
      }))
    },
    parentDirectory: (
      _: unknown,
      { parentDirectory }: { parentDirectory: string }
    ) => parentDirectory,
    FileInfo: {
      name: ({ name }: FileInfo) => name,
      type: ({ type }: FileInfo) => type,
    },
  },
  Mutation: {
    uploadFileList: async (
      _: unknown,
      {
        parentDirectory,
        fileList,
      }: { parentDirectory: string; fileList: File[] }
    ) => {
      // fsp.appendFile()
      return 'fileList'
    },
  },
}

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
})
