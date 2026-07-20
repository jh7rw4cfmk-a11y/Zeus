"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createBooking(
  sessionId: string,
  locale: string,
  formData: FormData
) {
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const iceSession = await prisma.iceSession.findUnique({
    where: { id: sessionId },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });
  if (!iceSession) {
    redirect(`/${locale}/schedule`);
  }

  const booked = iceSession.bookings.reduce(
    (sum, b) => sum + b.numAdults + b.numKids,
    0
  );
  const spotsLeft = Math.max(iceSession.capacity - booked, 0);

  const requestedAdults = Number(formData.get("adults"));
  const requestedKids = Number(formData.get("kids"));
  const numAdults = Number.isFinite(requestedAdults)
    ? Math.max(0, Math.trunc(requestedAdults))
    : 0;
  const numKids =
    iceSession.kidsAllowed && Number.isFinite(requestedKids)
      ? Math.max(0, Math.trunc(requestedKids))
      : 0;
  const totalGuests = numAdults + numKids;

  if (totalGuests < 1 || totalGuests > spotsLeft) {
    redirect(`/${locale}/book/${sessionId}?error=full`);
  }

  const totalSar =
    numAdults * iceSession.priceAdultSar + numKids * iceSession.priceKidSar;

  const booking = await prisma.booking.create({
    data: {
      userId: authSession.user.id,
      sessionId,
      numAdults,
      numKids,
      totalSar,
      payment: {
        create: { amountSar: totalSar, status: "MOCK_PAID" },
      },
    },
  });

  redirect(`/${locale}/book/${sessionId}/success?bookingId=${booking.id}`);
}

export async function cancelBooking(bookingId: string, locale: string) {
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (booking && booking.userId === authSession.user.id) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  }

  redirect(`/${locale}/account`);
}
