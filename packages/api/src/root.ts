import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { speakRouter } from "./router/spook";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  speak: speakRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
