import type { Metadata } from "next";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  openGraphImage?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "SuryaOS Web";

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${normalizedPath}`;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = `${baseUrl}${input.path ?? ""}`;
  const normalizedOgImage = input.openGraphImage ? toAbsoluteUrl(input.openGraphImage) : undefined;
  const openGraphImages = normalizedOgImage ? [{ url: normalizedOgImage }] : undefined;
  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName,
      type: "website",
      images: openGraphImages
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: normalizedOgImage ? [normalizedOgImage] : undefined
    }
  };
}
