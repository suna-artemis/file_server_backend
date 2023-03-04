# File Server Backend

## GraphQL Yoga, TypeGraphQL

## run it

1. install package

    `pnpm install`

2. start dev

    `pnpm dev`

3. start production

    `pnpm start`


## backup
1. install prisma

​	`pnpm add -D --save-exact prisma @prisma/client`

2. init prisma

    `pnpm prisma init`

3. create table structure

    ```prisma
    datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
    }
    
    generator client {
        provider = "prisma-client-js"
    }
    
    model Link {
        id          Int      @id @default(autoincrement())
        createdAt   DateTime @default(now())
        desc        String
        url         String
    }
    ```

4. execute migrate command and named it like 'init'

    `pnpm prisma migrate dev`

5. update prisma model from db

    <code>pnpm prisma generate</code>

6. running prisma GUI
    `pnpm prisma studio`

7. 
