const routePath = 'api/v1/materials'

export const routes = {
    materials: {
        root: `${routePath}`,
        search: `${routePath}/search`,
    },
    materials_category: {
        root: `${routePath}/category`,
    }
  }