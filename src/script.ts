import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  // mutation your db
  const newLink = await prisma.link.create({
    data: {
      desc: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  })
  // query from your db
  const allLinks = await prisma.link.findMany()
  console.log('allLinks :>> ', allLinks)
}

main().finally(async () => {
  await prisma.$disconnect()
})
