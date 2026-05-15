// @ts-ignore
import server from "../dist/server/index.js";

export const config = {
  runtime: "edge",
};

export default function handler(request: Request): Promise<Response> | Response {
  return server.fetch(request, {}, {});
}
