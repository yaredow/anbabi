/* import { auth } from "./auth";
import { createMiddleware } from "hono/factory";

type AdditionalContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const SessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  },
); */
