import defaultSettings from '@/settings'

const title = defaultSettings.title || '开发运维平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
