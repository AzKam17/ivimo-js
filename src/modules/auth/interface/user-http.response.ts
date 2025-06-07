import { t } from "elysia";
import { Timestamp } from "typeorm";

export const UserResponseSchema = t.Object({
  id: t.String(),
  first_name: t.String(),
  last_name: t.String(),
  email: t.String(),
  phone_number: t.String(),
});

interface UserResponseProps {
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

export const UserTokenResponseSchema = t.Object({
  token: t.String(),
  timestamp: t.Number(),
});

interface UserTokenResponseProps {
  token: string;
}

export class UserTokenResponse {
  constructor(props: UserTokenResponseProps) {
    return {
     ...props,
     timestamp: (new Date()).getTime(),
    }
  }
}