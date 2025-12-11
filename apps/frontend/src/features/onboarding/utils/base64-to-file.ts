// ============================================================================
// BASE64 TO FILE CONVERTER
// Converts base64 data URLs back to File objects for upload
// ============================================================================

/**
 * Converts a base64 data URL to a File object
 * @param dataUrl - The base64 data URL (e.g., "data:image/png;base64,...")
 * @param filename - The filename for the File object
 * @returns File object
 */
export function base64ToFile(dataUrl: string, filename: string): File {
  // Extract mime type and base64 data
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * Converts multiple base64 data URLs to File objects
 * @param dataUrls - Array of base64 data URLs
 * @param filenamePrefix - Prefix for generated filenames (e.g., "gallery")
 * @returns Array of File objects
 */
export function base64ArrayToFiles(dataUrls: string[], filenamePrefix: string = 'image'): File[] {
  return dataUrls.map((dataUrl, index) => {
    const extension = dataUrl.match(/data:image\/(\w+);/)?.[1] || 'png';
    const filename = `${filenamePrefix}_${index + 1}.${extension}`;
    return base64ToFile(dataUrl, filename);
  });
}
