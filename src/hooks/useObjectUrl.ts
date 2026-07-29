import { useEffect, useState } from "react";

function useObjectUrl(blob: Blob | undefined): string | null {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!blob) {
      queueMicrotask(() => {
        if (!isCancelled) {
          setObjectUrl(null);
        }
      });

      return () => {
        isCancelled = true;
      };
    }

    const nextObjectUrl = URL.createObjectURL(blob);

    queueMicrotask(() => {
      if (!isCancelled) {
        setObjectUrl(nextObjectUrl);
      }
    });

    return () => {
      isCancelled = true;
      URL.revokeObjectURL(nextObjectUrl);
    };
  }, [blob]);

  return objectUrl;
}

export default useObjectUrl;
