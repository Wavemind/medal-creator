// Classifies the media extensions into types
export const mediaType = (extension: string): string => {
  switch (extension) {
    case '.ts':
    case '.mp4':
    case '.mkv':
    case '.webm':
    case '.3gp':
      return 'video'
    case '.bmp':
    case '.gif':
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.webp':
    case '.heic':
    case '.heif':
      return 'image'
    case '.aac':
    case '.amr':
    case '.flac':
    case '.m4a':
    case '.mp3':
    case '.ogg':
    case '.wav':
      return 'image'
    default:
      return 'media'
  }
}

// Formats the file size from bytes into a readable value with unit
export const formatBytes = (bytes: number) => {
  if (bytes == 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Download directly a file
 * @param url string
 */
export const downloadFile = (url: string) => {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.target = '_blank'

  // Trigger a click event on the anchor to open it in a new tab
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  anchor.dispatchEvent(clickEvent)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}
