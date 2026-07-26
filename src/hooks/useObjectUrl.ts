import { useEffect, useMemo } from "react";

function useObjectUrl(blob: Blob | undefined): string | null {
  const objectUrl = useMemo(() => {
    if (!blob) {
      return null;
    }

    return URL.createObjectURL(blob);
  }, [blob]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return objectUrl;
}

export default useObjectUrl;
