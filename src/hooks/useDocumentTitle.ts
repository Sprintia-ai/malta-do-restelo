import { useEffect } from "react";
import { SITE_NAME } from "@/data/timelineData";

/** Sets `<title>` as "Page | Malta do Restelo". */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
  }, [title]);
}
