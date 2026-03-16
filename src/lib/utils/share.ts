/**
 * Utility for sharing content using the Web Share API.
 * Falls back to clipboard if the API is not supported.
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  if (navigator.share && navigator.canShare?.(data)) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      console.error('Error sharing:', error);
    }
  }

  // Fallback to clipboard
  if (data.url) {
    try {
      await navigator.clipboard.writeText(data.url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }

  return false;
}
