import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { Company } from "@/modules/business/infrastructure/entities";
import { CompanyRepository } from "@/modules/business/infrastructure/repositories";

export class CreateCompanyCommand extends BaseCommand {
  name: string;
  address?: string;
  description?: string;
  created_by: string;
  constructor(props: CommandProps<CreateCompanyCommand>) {
    super(props);
    this.name = props.name;
    this.address = props.address;
    this.description = props.description;
    this.created_by = props.created_by;
  }
}

export class CreateCompanyCommandHandler extends BaseCommandHandler<CreateCompanyCommand, Company> {
  async execute(command: CreateCompanyCommand): Promise<Company> {
    const repository = CompanyRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    // check if user as already a company
    const user = await userRepository.findById(command.created_by);
    if (user?.extras?.companyId) {
      throw new BaseError({
        statusCode: 500,
        message: "User already has a company"
      });
    }

    // check if company already exists
    const companyExists = await repository.findOneBy({ownedBy: command.created_by});
    if (companyExists) {
      throw new BaseError({
        statusCode: 500,
        message: "User already has a company"
      });
    }

    const company = await repository.create({
      name: command.name,
      address: command.address,
      description: command.description,
      createdBy: command.created_by,
      ownedBy: command.created_by,
    });

    UserRepository.getInstance().update(command.created_by,{
      extras: {
        companyId: company.id,
      }
    });

    return company;
  }
}