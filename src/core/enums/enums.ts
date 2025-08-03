export enum PropertyAdTypeEnum {
  SALE = "sale",
  RENT = "rent",
}

export type PropertyType = "LAND" | "APPARTEMENT" | "VILLA" | "RESIDENCE";

export enum UserRoleEnum {
  ADMIN =       "admin",
  CLIENT =      "client",
  AGENT_COM =   "agent_com",
  RESP_COM =    "resp_com",
  PARTNER =     "partner",
  FOURNISSEUR = "fournisseur",
  AGENT_OPS =   "agent_ops",
  RESP_OPS =    "resp_ops"
}

export type UserRoleEnumWithoutAdmin = Exclude<UserRoleEnum, UserRoleEnum.ADMIN>

export const UserRoleEnumWithoutAdminAndFournisseurAndClient = Object.values(UserRoleEnum).filter(item => item !== UserRoleEnum.FOURNISSEUR && item !== UserRoleEnum.ADMIN && item !== UserRoleEnum.CLIENT)
export const UserRoleEnumWithoutAdminAndFournisseur = Object.values(UserRoleEnum).filter(item => item !== UserRoleEnum.FOURNISSEUR && item !== UserRoleEnum.ADMIN)

export enum AppointmentStatus {
  DONE = "done",
  PENDING = "pending",
  PAST = "past",
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
