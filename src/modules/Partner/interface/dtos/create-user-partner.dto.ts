import { t } from "elysia";

export const CreateUserPartenaireDto = t.Object({
    first_name: t.String({}),
    last_name: t.String({}),
    email: t.String({ format: "email" }),
    role: t.String({}),
    phone_number: t.String({ minLength: 10, maxLength: 10 }),
    password: t.String({ minLength: 8 })
});

export const CreateUserPartenerClientDto = t.Object({
    first_name: t.String({}),
    last_name: t.String({}),
    email: t.String({ format: "email" }),
    phone_number: t.String({ minLength: 10, maxLength: 10 }),
    password: t.String({ minLength: 8 }),
});

export const EditUserPartenaireDto = t.Object({
    first_name: t.String({}),
    last_name: t.String({}),
    email: t.String({ format: "email" }),
    role: t.String({}),
    companyId: t.String({}),
    phone_number: t.String({ minLength: 10, maxLength: 10 }),
});
