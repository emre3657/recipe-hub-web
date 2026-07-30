// src/hooks/useDocumentTitle.ts
import { useEffect } from "react";

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Recipe Hub`;
  }, [title]);
}

export default useDocumentTitle;
