/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import path from "path";
import payload from "payload";
import { InitOptions } from "payload/config";

// Configure the pathto the env variables

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Get cached payload

let cached = (global as any).payload;

// if there is not cached payload,set new payload to cache

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

// Create the Args interface
interface Args {
  initOptions?: Partial<InitOptions>;
}

// Create a database /cached client

export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  // Check if the payload secret exists
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD SECRET is missing");
  }

  // Check if there is cached client
  if (cached.client) {
    return cached.client;
  }

  // Check if there is cached promise
  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  // Wait for the promise to resolve
  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
