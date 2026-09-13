import { getInitiatives } from "@/lib/parlamento/data";
import { toListItem } from "@/lib/parlamento/filters";

// Written once at build time. The list page filters this file in the browser.
export const dynamic = "force-static";

export function GET() {
  return Response.json(getInitiatives().map(toListItem));
}
