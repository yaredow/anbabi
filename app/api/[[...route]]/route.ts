import { Hono } from "hono";
import { handle } from "hono/vercel";
import bookRoute from "@/features/books/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/books", bookRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
