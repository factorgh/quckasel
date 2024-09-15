import { initTRPC } from "@trpc/server";

// Initialize the trpc client
const t = initTRPC.context().create();

// Create the router
export const router = t.router;
export const publicProcedure = t.procedure;
