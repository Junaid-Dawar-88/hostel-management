-- CreateTable
CREATE TABLE "Warden" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "wardenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "meal" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "wardenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "rollNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "guardPhone" TEXT,
    "cnic" TEXT,
    "imageUrl" TEXT,
    "email" TEXT,
    "course" TEXT,
    "feeTotal" DOUBLE PRECISION,
    "feePaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roomId" INTEGER,
    "wardenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warden_email_key" ON "Warden"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_wardenId_number_key" ON "Room"("wardenId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_wardenId_day_meal_key" ON "MenuItem"("wardenId", "day", "meal");

-- CreateIndex
CREATE UNIQUE INDEX "Student_wardenId_rollNo_key" ON "Student"("wardenId", "rollNo");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_wardenId_fkey" FOREIGN KEY ("wardenId") REFERENCES "Warden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_wardenId_fkey" FOREIGN KEY ("wardenId") REFERENCES "Warden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_wardenId_fkey" FOREIGN KEY ("wardenId") REFERENCES "Warden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
