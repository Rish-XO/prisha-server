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
    .query(async ({ input }) => {
      const book = await pool.query("SELECT * FROM books WHERE book_id  = $1", [
        input.id,
      ]);
      console.log(book.rows);
      if (book.rows.length > 0) {
        return book.rows[0];
      }
    }),
  create: t.procedure
    .input(
      z.object({
        title: z.string(),
        author: z.string(),
        time: z.string(),
        description: z.string(),
        image: z.string(),
        pdf: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // console.log(input);
      const newBook = await pool.query(
        "INSERT INTO books (title, author, time, description, image, pdf) VALUES ($1, $2, $3 ,$4 , $5 ,$6) RETURNING *",
        [
          input.title,
          input.author,
          input.time,
          input.description,
          input.image,
          input.pdf,
        ]
      );
      // console.log(newBook.rows[0]);
      return { id: newBook.rows[0].book_id };
    }),
});

export type AppRouter = typeof appRouter;
