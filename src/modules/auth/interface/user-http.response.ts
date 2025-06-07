import { t } from "elysia";

export const UserResponseSchema = t.Object({
  id: t.String(),
  first_name: t.String(),
  last_name: t.String(),
  email: t.String(),
  phone_number: t.String(),
});

export interface UserResponseProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export class UserResponse {
  constructor(props: UserResponseProps) {
    return {
      ...props,
    }
  }
}
