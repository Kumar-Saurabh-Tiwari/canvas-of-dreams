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
import SkumarAIWidget from "@/components/portfolio/SkumarAIWidget";

const siteUrl = "https://www.skumar.space/";
const ogImageUrl = `${siteUrl}assets/bg-img.png`;
const personName = "Saurav Kumar";
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personName,
  url: siteUrl,
  jobTitle: "Full Stack Web Developer",
};
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${personName} Portfolio`,
  url: siteUrl,
};

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
      { title: "Saurav Kumar Portfolio | skumar.space" },
      { name: "description", content: "Saurav Kumar portfolio (skumar.space) — full stack web developer specializing in React, Next.js, Node.js, and modern web systems." },
      { name: "author", content: personName },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "_8HK3ZhzNftGrRNBt_EuoqXJlcZY9v6cEwM_BlT_tlU" },
      { name: "keywords", content: "Saurav Kumar, Saurav Kumar portfolio, skumar space portfolio, skumar.space, full stack developer, React, Next.js, Node.js, engineering the unseen" },
      { property: "og:title", content: "Saurav Kumar Portfolio | skumar.space" },
      { property: "og:description", content: "Saurav Kumar portfolio (skumar.space) — full stack web developer. React, Next.js, Node.js and modern web systems." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Saurav Kumar Portfolio | skumar.space" },
      { name: "twitter:description", content: "Saurav Kumar portfolio (skumar.space) — full stack web developer. React, Next.js, Node.js and modern web systems." },
      { property: "og:image", content: ogImageUrl },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "Saurav Kumar portfolio hero artwork" },
      { name: "twitter:image", content: ogImageUrl },
      { name: "twitter:image:alt", content: "Saurav Kumar portfolio hero artwork" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: siteUrl },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify([personJsonLd, websiteJsonLd]) },
    ],
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
      <SkumarAIWidget />
    </QueryClientProvider>
  );
}
