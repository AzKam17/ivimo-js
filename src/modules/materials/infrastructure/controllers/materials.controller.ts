import Elysia from "elysia";

export const MaterialsController = new Elysia({ prefix: "/materials" })
    .get("/", async () => {
        return "Hello materials";
    }, {
        detail: {
            tags: ['Materials']
        }
    })
;
