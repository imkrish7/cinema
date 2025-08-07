import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PrismaTransactionClient = typeof PrismaClient


export {
    prisma
}

export type {
    PrismaTransactionClient
}