import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { Guard } from "@/core/utils";
import { Company } from "@/modules/business/infrastructure/entities";
import { CompanyRepository } from "@/modules/business/infrastructure/repositories";

export class GetCompanyQuery extends BaseQuery {
  id: string;
  constructor(props: QueryProps<GetCompanyQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class GetCompanyQueryHandler extends BaseQueryHandler<GetCompanyQuery, Company> {
  async execute(query: GetCompanyQuery): Promise<Company> {
    const repository = CompanyRepository.getInstance();

    const comp = await repository.findById(query.id);

    if (Guard.isEmpty(comp)) {
      throw new BaseError({
        statusCode: 404,
        message: "Company not found",
      });
    }

    return comp!;
  }
}
