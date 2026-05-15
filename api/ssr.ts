import server from "../src/server";

export const config = {
  runtime: "edge",
};

export default function handler(request: Request): Promise<Response> | Response {
  return server.fetch(request, {}, {});
}
