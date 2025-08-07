-- CreateTable
CREATE TABLE "public"."Cinema" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "seatConfiguration" JSONB NOT NULL,
    "screenType" TEXT,
    "features" TEXT[],
    "numberOfSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "id" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "cinemaId" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_cinemaId_row_seatNumber_key" ON "public"."Seat"("cinemaId", "row", "seatNumber");

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "public"."Cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
