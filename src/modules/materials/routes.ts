const routePath = 'api/v1/materials'

export const routes = {
    materials: {
        root: `${routePath}`,
        search: `${routePath}/search`,
        detail: `${routePath}/:id`,
    },
    materials_category: {
        root: `${routePath}/category`,
    }
  }