import { User } from "@prisma/client";
import { Request } from "express";

declare global {
  type RequestAuthed = Request & {
    user: User
  };
}

export {};