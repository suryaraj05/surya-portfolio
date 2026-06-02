import type { Metadata } from "next";

import "@/app/globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { QueryProvider } from "@/lib/query/provider";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "SuryaOS Web",
  description: "AI infrastructure platform website foundation."
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <SiteShell>{children}</SiteShell>
        </QueryProvider>
      </body>
    </html>
  );
}
