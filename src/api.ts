import { initTRPC } from "@trpc/server";
import { z } from "zod";
import pool from "./db";

export const t = initTRPC.create();

export const appRouter = t.router({
  getAllBooks: t.procedure.query(async () => {
    const books = await pool.query("SELECT * FROM books");
    return books;
  }),
  getABook: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      console.log(input);
      return {balls: 'lalal'}
    }),
});

export type AppRouter = typeof appRouter;
