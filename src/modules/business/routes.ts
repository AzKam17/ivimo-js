const routePath = "api/v1/business";
const routePathAuth = "api/v1/auth/business";

export const routes = {
  business: {
    root: `${routePath}`,
    detail: `${routePath}/:id`,
  },
  business_auth: {
    root: `${routePathAuth}`,
  },
  agent: {
    root: `${routePath}/:businessId/agent`,
  },
  appointment: {
    root: `api/v1/appointment`,
  }
};
