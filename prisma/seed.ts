import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.warden.upsert({
    where: { email: "warden@hostel.local" },
    update: {},
    create: {
      name: "Default Warden",
      email: "warden@hostel.local",
      password: "changeme",
    },
  });

  const rooms = [
    { number: "101", floor: 1, capacity: 3 },
    { number: "102", floor: 1, capacity: 3 },
    { number: "201", floor: 2, capacity: 2 },
  ];

  for (const r of rooms) {
    await prisma.room.upsert({
      where: { number: r.number },
      update: {},
      create: r,
    });
  }
  console.log("Seeded.");
}

main().finally(() => prisma.$disconnect());
