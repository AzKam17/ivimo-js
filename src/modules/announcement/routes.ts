const routePath = "api/v1/announcement";
const routePathAuth = "api/v1/auth/announcement";

export const routes = {
  announcement_auth: {
    root: `${routePathAuth}`,
    detail: `${routePathAuth}/:id`,
    active: `${routePathAuth}/active/:id`,
    diseable: `${routePathAuth}/diseable/:id`,
  },
  announcement: {
    root: `${routePath}`,
    detail: `${routePath}/:id`,
  }
};
