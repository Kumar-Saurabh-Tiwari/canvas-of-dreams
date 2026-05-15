// @ts-ignore
import server from "../dist/server/index.js";

// Vercel serverless function (Node.js runtime)
declare const Buffer: any;

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url, `${protocol}://${host}`);

  const requestInit: any = {
    method: req.method,
    headers: req.headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    // Pipe the Node request body
    const bodyContent = await new Promise<any>((resolve, reject) => {
      const chunks: any[] = [];
      req.on('data', (chunk: any) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
    if (bodyContent.length > 0) {
      requestInit.body = bodyContent;
    }
  }

  const webRequest = new Request(url, requestInit);

  try {
    const fetchRes = await server.fetch(webRequest, {}, {});
    
    res.status(fetchRes.status);
    fetchRes.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    if (fetchRes.body) {
      const reader = fetchRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        }
        res.write(value);
      }
    } else {
      res.end();
    }
  } catch (error) {
    console.error("SSR Handler Error:", error);
    res.status(500).end("Internal Server Error");
  }
}
