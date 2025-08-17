import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { HideMaterialCommand, HideMaterialCommandHandler } from "@/modules/materials/interface/commands/hide-material.command";
import { MaterialsRepository } from "@/modules/materials/infrastructure/repositories";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { MemberAbilityFactory } from "@/core/infrastructure/services/access-control/member-ability.factory";
import { BaseError } from "@/core/base/errors";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRoleEnum } from "@/core/enums/enums";

describe("HideMaterialCommandHandler", () => {
  const mockMaterial: Materials = {
    id: "123",
    name: "Test Material",
    supplier_id: "456",
    isVisible: true,
  } as Materials;

  const mockUser: User = {
    id: "456",
    role: UserRoleEnum.FOURNISSEUR,
  } as User;

  const mockMaterialsRepository = {
    findOneBy: mock(() => Promise.resolve(mockMaterial)),
    update: mock(() => Promise.resolve(true)),
  };

  const mockUserRepository = {
    findOneBy: mock(() => Promise.resolve(mockUser)),
  };

  const mockAbility = {
    cannot: mock(() => false),
  };

  const mockAbilityFactory = {
    getAbilities: mock(() => Promise.resolve(mockAbility)),
  };

  beforeEach(() => {
    mockMaterialsRepository.findOneBy.mockReset();
    mockMaterialsRepository.update.mockReset();
    mockUserRepository.findOneBy.mockReset();
    mockAbility.cannot.mockReset();
    mockAbilityFactory.getAbilities.mockReset();

    mockMaterialsRepository.findOneBy.mockResolvedValue(mockMaterial);
    mockUserRepository.findOneBy.mockResolvedValue(mockUser);
    mockAbility.cannot.mockReturnValue(false);
    mockAbilityFactory.getAbilities.mockResolvedValue(mockAbility);

    spyOn(MaterialsRepository, "getInstance").mockReturnValue(
      mockMaterialsRepository as unknown as MaterialsRepository
    );
    spyOn(UserRepository, "getInstance").mockReturnValue(
      mockUserRepository as unknown as UserRepository
    );
    spyOn(MemberAbilityFactory, "getInstance").mockReturnValue(
      mockAbilityFactory as unknown as MemberAbilityFactory
    );
  });

  it("should successfully hide a material", async () => {
    const command = new HideMaterialCommand({
      id: "123",
      supplier_id: "456",
    });
    const handler = new HideMaterialCommandHandler();

    const result = await handler.execute(command);

    expect(result).toBe(true);
  });

  it("should throw BaseError when user is not authorized", async () => {
    mockAbility.cannot.mockReturnValue(true);

    const command = new HideMaterialCommand({
      id: "123",
      supplier_id: "456",
    });
    const handler = new HideMaterialCommandHandler();

    try {
      await handler.execute(command);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(BaseError);
      expect((err as BaseError).statusCode).toBe(403);
      expect((err as BaseError).message).toBe(
        "You are not authorized to hide this material"
      );
    }

    expect(mockMaterialsRepository.update).not.toHaveBeenCalled();
  });

  it("should throw Error when material does not exist", async () => {
    mockMaterialsRepository.findOneBy.mockImplementation(() => {
      throw new Error("Entity not found");
    });

    const command = new HideMaterialCommand({
      id: "non-existent-id",
      supplier_id: "456",
    });
    const handler = new HideMaterialCommandHandler();

    try {
      await handler.execute(command);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe("Entity not found");
    }

    expect(mockMaterialsRepository.update).not.toHaveBeenCalled();
  });
});


