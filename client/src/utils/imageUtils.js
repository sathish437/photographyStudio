/**
 * Converts a raw image URL (Cloudinary or Unsplash) into a responsive, format-optimized URL.
 * Applies Cloudinary 'f_auto,q_auto' and optional width limits.
 *
 * @param {string} url - The original image URL
 * @param {number} [width] - Desired target width in pixels
 * @returns {string} - The optimized image URL
 */
export function getOptimizedImageUrl(url, width) {
  if (!url || typeof url !== 'string') return '';

  // Cloudinary image transformation
  if (url.includes('res.cloudinary.com') || url.includes('/upload/')) {
    const transformString = width
      ? `f_auto,q_auto,w_${width},c_limit`
      : 'f_auto,q_auto';

    if (url.includes('/upload/f_auto,q_auto/')) {
      if (width) {
        return url.replace('/upload/f_auto,q_auto/', `/upload/${transformString}/`);
      }
      return url;
    }
    
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformString}/`);
    }
  }

  // Unsplash image transformation
  if (url.includes('images.unsplash.com')) {
    let updatedUrl = url;
    if (width) {
      if (updatedUrl.includes('w=')) {
        updatedUrl = updatedUrl.replace(/w=\d+/, `w=${width}`);
      } else {
        updatedUrl += `&w=${width}`;
      }
    }
    if (!updatedUrl.includes('auto=format')) {
      updatedUrl += '&auto=format';
    }
    return updatedUrl;
  }

  return url;
}
