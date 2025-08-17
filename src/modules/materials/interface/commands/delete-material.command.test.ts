import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { MaterialsRepository } from "@/modules/materials/infrastructure/repositories";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { MemberAbilityFactory } from "@/core/infrastructure/services/access-control/member-ability.factory";
import { BaseError } from "@/core/base/errors";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRoleEnum } from "@/core/enums/enums";
import { DeleteMaterialCommand, DeleteMaterialCommandHandler } from "@/modules/materials/interface/commands/delete-material.command";

describe("DeleteMaterialCommandHandler", () => {
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
    delete: mock(() => Promise.resolve(true)),
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
    mockMaterialsRepository.delete.mockReset();
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

  it("should successfully delete a material", async () => {
    const command = new DeleteMaterialCommand({
      id: "123",
      supplier_id: "456",
    });
    const handler = new DeleteMaterialCommandHandler();

    const result = await handler.execute(command);

    expect(result).toBe(true);
    expect(mockMaterialsRepository.delete).toHaveBeenCalledWith("123");
  });

  it("should throw BaseError when user is not authorized", async () => {
    mockAbility.cannot.mockReturnValue(true);

    const command = new DeleteMaterialCommand({
      id: "123",
      supplier_id: "456",
    });
    const handler = new DeleteMaterialCommandHandler();

    try {
      await handler.execute(command);
      expect(true).toBe(false); // This line should not be reached
    } catch (err) {
      expect(err).toBeInstanceOf(BaseError);
      expect((err as BaseError).statusCode).toBe(403);
      expect((err as BaseError).message).toBe(
        "You are not authorized to delete this material"
      );
    }

    expect(mockMaterialsRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw Error when material does not exist", async () => {
    mockMaterialsRepository.findOneBy.mockImplementation(() => {
      throw new Error("Entity not found");
    });

    const command = new DeleteMaterialCommand({
      id: "non-existent-id",
      supplier_id: "456",
    });
    const handler = new DeleteMaterialCommandHandler();

    try {
      await handler.execute(command);
      expect(true).toBe(false); // This line should not be reached
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe("Entity not found");
    }

    expect(mockMaterialsRepository.delete).not.toHaveBeenCalled();
  });
});