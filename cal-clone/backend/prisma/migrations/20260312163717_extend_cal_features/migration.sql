-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "bufferAfter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bufferBefore" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DateOverride" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DateOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingQuestion" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BookingQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingAnswer" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "BookingAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DateOverride" ADD CONSTRAINT "DateOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingQuestion" ADD CONSTRAINT "BookingQuestion_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAnswer" ADD CONSTRAINT "BookingAnswer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAnswer" ADD CONSTRAINT "BookingAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "BookingQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
