import { UserRoleEnum } from "@/core/enums/enums";
import { User } from "@/modules/auth/infrastructure/entities";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { AbilityBuilder, createMongoAbility, PureAbility, InferSubjects } from "@casl/ability";

type Action = "add" | "remove" | "update" | "read";
type Subjects = InferSubjects<typeof Materials> | "all";

type AppAbility = PureAbility<[Action, Subjects]>;

export class MemberAbilityFactory {
  private static instance: MemberAbilityFactory;

  private constructor() {}

  static getInstance() {
    if (!MemberAbilityFactory.instance) {
      MemberAbilityFactory.instance = new MemberAbilityFactory();
    }
    return MemberAbilityFactory.instance;
  }

  async getAbilities(user: User): Promise<AppAbility> {
    switch (user.role) {
      case UserRoleEnum.FOURNISSEUR:
        return this.setFournisseurAbilities(user);
      default:
        return this.setFournisseurAbilities(user);
    }
  }

  setAdminAbilities(user: User){
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    return build();
  }

  setFournisseurAbilities(user: User){
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    can('add', Materials);
    can('remove', Materials, { supplier_id: user.id });
    can('update', Materials, { supplier_id: user.id });
    can('read', Materials, { supplier_id: user.id });
    return build();
  }
}
