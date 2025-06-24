export enum  PropertyAdTypeEnum {
  SALE = "sale",
  RENT = "rent",
}

export type PropertyType = "LAND" | "APPARTEMENT" | "VILLA" | "RESIDENCE"

export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
  PARTNER = "partner",
  AGENT = "agent"
}

export enum UserRoleEnumWithoutAdmin {
  USER = UserRoleEnum.USER,
  PARTNER = UserRoleEnum.PARTNER,
  AGENT = UserRoleEnum.AGENT
}

// export namespace PropertyAdTypeEnum {
//   export function from(value: string): PropertyAdTypeEnum {
//     switch (value.toLowerCase()) {
//       case "sale":
//         return PropertyAdTypeEnum.SALE;
//       case "rent":
//         return PropertyAdTypeEnum.RENT;
//       default:
//         throw new Error(`Invalid PropertyAdTypeEnum value: ${value}`);
//     }
//   }
// }