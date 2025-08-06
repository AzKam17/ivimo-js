
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

export type UserRoleWithoutAdminAndFournisseur = Exclude<UserRoleEnum, UserRoleEnum.ADMIN | UserRoleEnum.FOURNISSEUR>
export type UserRoleWithoutAdminFournisseurAndClient = Exclude<UserRoleEnum, UserRoleEnum.ADMIN | UserRoleEnum.FOURNISSEUR | UserRoleEnum.CLIENT>

export const OPERATIONAL_USER_ROLES = Object.values(UserRoleEnum).filter(
  role => ![
    UserRoleEnum.ADMIN,
    UserRoleEnum.FOURNISSEUR,
    UserRoleEnum.CLIENT
  ].includes(role)
)

export const NON_ADMIN_NON_SUPPLIER_ROLES = Object.values(UserRoleEnum).filter(
  role => ![
    UserRoleEnum.ADMIN,
    UserRoleEnum.FOURNISSEUR
  ].includes(role)
)

export enum AppointmentStatus {
  DONE = "done",
  PENDING = "pending",
  PAST = "past",
}

export enum AnnouncementStatus {
  EXPIRED = "expired",
  VALID = "valid",
  PAUSE = "pause",
}

export enum AnnouncementType {
  VIP= "vip",
  SPONSOR = "sponsor",
  NOVIP = "novip"
}

export enum AnnouncementTarget {
  ALL= "all",
  BUYER = "buyer",
  INVESTITOR = "investor",
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
