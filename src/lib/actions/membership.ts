"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function subscribeMembership(planId: string, locale: string) {
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) {
    redirect(`/${locale}/account/membership`);
  }

  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  const membership = await prisma.membership.upsert({
    where: { userId: authSession.user.id },
    update: {
      planId,
      status: "ACTIVE",
      creditsRemaining: plan.monthlyCredits,
      startDate: new Date(),
      renewalDate,
    },
    create: {
      userId: authSession.user.id,
      planId,
      creditsRemaining: plan.monthlyCredits,
      renewalDate,
    },
  });

  await prisma.payment.create({
    data: {
      membershipId: membership.id,
      amountSar: plan.priceSar,
      status: "MOCK_PAID",
    },
  });

  redirect(`/${locale}/account`);
}
