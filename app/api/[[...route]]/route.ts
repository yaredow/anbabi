import { handle } from "hono/vercel";
import { Hono } from "hono";

import collectionRoute from "@/features/collections/server/route";
import assistanceRute from "@/features/assistants/server/route";
import accountRoute from "@/features/account/server/route";
import bookRoute from "@/features/books/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/books", bookRoute)
  .route("/assistants", assistanceRute)
  .route("/collections", collectionRoute)
  .route("/accounts", accountRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
