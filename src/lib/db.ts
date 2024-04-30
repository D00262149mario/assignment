import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        $allOperations({ operation, args, query }) {
          if (
            ["create", "update"].includes(operation) &&
            args.data["password"]
          ) {
            args.data["password"] = bcrypt.hashSync(args.data["password"], 10);
          }
          return query(args);
        },
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
