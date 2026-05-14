import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ClientOnly,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import Scene from "@/components/portfolio/Scene";
import SideNav from "@/components/portfolio/SideNav";
import SmoothScroll from "@/components/portfolio/SmoothScroll";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 font-mono">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground text-glow">404</h1>
        <p className="mt-4 text-xs tracking-widest text-muted-foreground">
          [ SIGNAL_LOST // PAGE_NOT_FOUND ]
        </p>
        <Link to="/" className="mt-6 inline-block text-xs tracking-widest text-violet-glow hover:text-foreground transition-colors">
          → RETURN TO ORIGIN
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4 font-mono">
      <div className="max-w-md text-center">
        <h1 className="text-xs tracking-widest text-destructive">[ RUNTIME_ERROR ]</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 text-xs tracking-widest text-violet-glow hover:text-foreground transition-colors"
        >
          → RETRY
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { name: "description", content: "Engineering the unseen. A brutalist approach to modern JavaScript — React, Next.js, Node.js." },
      { name: "author", content: "Kumar Saurabh Tiwari" },
      { property: "og:title", content: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { property: "og:description", content: "Engineering the unseen. A brutalist approach to modern JavaScript — React, Next.js, Node.js." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { name: "twitter:description", content: "Engineering the unseen. A brutalist approach to modern JavaScript — React, Next.js, Node.js." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a9504632-0d59-4ae3-b0ef-9f510132c20e" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a9504632-0d59-4ae3-b0ef-9f510132c20e" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body className="grain">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ClientOnly fallback={null}>
        <Scene />
      </ClientOnly>
      <SideNav />
      <ClientOnly
        fallback={
          <main className="relative z-10">
            <Outlet />
          </main>
        }
      >
        <SmoothScroll>
          <main className="relative z-10">
            <Outlet />
          </main>
        </SmoothScroll>
      </ClientOnly>
    </QueryClientProvider>
  );
}
