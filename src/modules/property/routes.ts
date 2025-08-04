const routePath = 'api/v1/property'
const routePathAuth = 'api/v1/auth/property'

export const routes = {
    property: {
        root: `${routePath}/`,
        detail: `${routePath}/:id`,
        search: `${routePathAuth}/search`,
        featured: `${routePathAuth}/featured`,
        recommendation: `${routePath}/recommended/:id`,
    },
    property_auth: {
        root: `${routePathAuth}/`,
        active: `${routePathAuth}/active/:id`,
        diseable: `${routePathAuth}/diseable/:id`,
        detail: `${routePathAuth}/:id`,
        detailByCompany: `${routePathAuth}/:id/company/:compadId`,
        bookmark: `${routePathAuth}/bookmark/:id`,
        company: `${routePathAuth}/company`,
    }
  }