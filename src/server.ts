import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";

import { appRouter } from "./trpc";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});
const start = async () => {
  // Get the payload client
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin Url ${cms.getAdminURL()}`);
      },
    },
  });
  // Allow next to handle requests from the express server(middleware)
  app.use((req, res) => nextHandler(req, res));

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Start next.js to handle server side rendering.
  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // listen to the server
  app.listen(PORT, async () => {
    payload.logger.info(`Next.js app url:${process.env.NEXT_APP_URL}`);
  });
};

start();
