import { initTRPC } from "@trpc/server";
import { z } from "zod";
import pool from "./db";

export const t = initTRPC.create();

export const appRouter = t.router({
  getAllBooks: t.procedure.input(z.string()).query(() => {
    const books = pool.query("SELECT * FROM books");
    return books;
  }),
});

export type AppRouter = typeof appRouter