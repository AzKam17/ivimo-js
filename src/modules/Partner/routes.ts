const routePath = 'api/v1/partner'
const routePathAuth = 'api/v1/auth/partner'

export const routes = {
    partner_auth: {
        root    : `${routePathAuth}/`,
        create  : `${routePathAuth}/user`,
        detail  : `${routePathAuth}/:id`,
        disable : `${routePathAuth}/disable/:id`,
        active  : `${routePathAuth}/active/:id`,
        list    : `${routePathAuth}/users`, //list users partner

    }
  }