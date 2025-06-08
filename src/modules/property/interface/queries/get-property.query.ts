import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { Guard } from "@/core/utils";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";

export class GetPropertyQuery extends BaseQuery {
  id: string;
  constructor(props: QueryProps<GetPropertyQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class GetPropertyQueryHandler extends BaseQueryHandler<GetPropertyQuery, Property> {
  async execute(query: GetPropertyQuery): Promise<Property> {
    const repository = PropertyRepository.getInstance();

    const property = await repository.findById(query.id);

    if (Guard.isEmpty(property)) {
      throw new BaseError({
        statusCode: 404,
        message: "Property not found",
      });
    }

    return property!;
  }
}
