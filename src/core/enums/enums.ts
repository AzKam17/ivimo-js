export enum PropertyAdTypeEnum {
  SALE = "sale",
  RENT = "rent",
}

export type PropertyType = "LAND" | "APPARTEMENT" | "VILLA" | "RESIDENCE";

export enum UserRoleEnum {
  ADMIN = "admin",
}

export enum UserRoleEnumWithoutAdmin {
  USER = "user",
  PARTNER = "partner",
  AGENT = "agent",
  SUPPLIER = "supplier",
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
