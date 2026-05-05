import { useEffect } from 'react'
import { siteConfigService } from '../services/api'

export function TypographyProvider({ children }) {
  useEffect(() => {
    siteConfigService.get()
      .then(data => {
        const config = data.config?.config_data || {}
        const root = document.documentElement

        // Apply typography variables
        if (config.font_family) {
          root.style.setProperty('--font-family', config.font_family)
        }
        if (config.base_font_size) {
          root.style.setProperty('--base-font-size', config.base_font_size)
        }
        if (config.base_font_weight) {
          root.style.setProperty('--base-font-weight', config.base_font_weight)
        }
        if (config.base_line_height) {
          root.style.setProperty('--base-line-height', config.base_line_height)
        }
        if (config.base_letter_spacing !== undefined) {
          root.style.setProperty('--base-letter-spacing', config.base_letter_spacing)
        }

        // Apply element-specific variables
        if (config.home_projects_font_size) {
          root.style.setProperty('--home-projects-font-size', config.home_projects_font_size)
        }
        if (config.home_projects_font_weight) {
          root.style.setProperty('--home-projects-font-weight', config.home_projects_font_weight)
        }
        if (config.nav_links_font_size) {
          root.style.setProperty('--nav-links-font-size', config.nav_links_font_size)
        }
        if (config.nav_links_font_weight) {
          root.style.setProperty('--nav-links-font-weight', config.nav_links_font_weight)
        }
        if (config.footer_font_size) {
          root.style.setProperty('--footer-font-size', config.footer_font_size)
        }
      })
      .catch(() => {})
  }, [])

  return <>{children}</>
}
