import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

import { MAX_FREE_COUNTS } from "@/constants";

export const increaseAPILimit = async () => {
  try {
    const { userId } = auth();
    if (!userId) {
      return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId,
      },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: { userId: userId },
        data: { count: userApiLimit.count + 1 },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 },
      });
    }
  } catch (error) {
    console.error("Error increasing API limit:", error);
    // Handle the error appropriately, e.g., return an error response or throw it further.
  }
};

export const checkAPILimit = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking API limit:", error);
    // Handle the error appropriately, e.g., return an error response or throw it further.
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();
  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};
