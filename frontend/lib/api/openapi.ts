import openapiContract from "@/src/contracts/openapi.json";

export const openapi = openapiContract;

export function getAvailableApiPaths(): string[] {
  return Object.keys(openapi.paths ?? {});
}
