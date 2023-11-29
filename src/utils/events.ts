import EventEmitter from "events";
import { prismaDB } from "./prisma.js";

export const EventHandler = new EventEmitter();

export enum EventNames {
  MutateRefreshToken,
  SendEmail,
}

export type MutateRefreshTokenPayloadObj = {
  token?: string;
  userId: string;
  type: "save" | "remove";
};

async function MutateRefreshToken(payload: MutateRefreshTokenPayloadObj) {
  let { userId, token, type } = payload;
  try {
    await prismaDB.user.update({
      where: {
        userId: userId,
      },
      data: {
        refreshToken: type == "save" ? token : null,
      },
    });
  } catch (error) {
    throw Error(error as string);
  }
}

function SendEmail() {
  console.log("Send email");
}

EventHandler.on(EventNames[0], MutateRefreshToken);
EventHandler.on(EventNames[1], SendEmail);
