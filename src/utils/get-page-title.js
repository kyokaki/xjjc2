import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Computecoin Batch Transfer Tool'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
