import { BaseError } from "@/core/base/errors";
import { UserRoleEnum } from "@/core/enums/enums";
import { UserRoleEnumWithoutAdmin } from "@/core/enums/enums";
import { User } from "@/modules/auth/infrastructure/entities";

export function rejectNonSupplierUser(user: User){
    if(user.role !== UserRoleEnum.ADMIN){
        throw new BaseError({
            statusCode: 403,
            message: "Forbidden",
        });
    }
}