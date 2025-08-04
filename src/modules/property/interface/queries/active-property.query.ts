import { BaseQuery, BaseQueryHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { PropertyRepository } from "../../infrastructure/repositories";
import { Property } from "../../infrastructure/entities";


export class ActivePropertyQuery extends BaseQuery {
  id: string;
  constructor(props: CommandProps<ActivePropertyQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class ActivePropertyQueryHandler extends BaseQueryHandler<ActivePropertyQuery, Property> {
  async execute(query: ActivePropertyQuery): Promise<Property> {
    const repository = PropertyRepository.getInstance();
    console.log('\n id actif => ', query.id)
    const property = await repository.findOneByWhithoutParamIsActive({id: query.id}, true);

    if (!property) {
      throw new BaseError({
        message: "property not found",
        statusCode: 404,
      });
    }

    property.isActive = true;

    const updatedProperty = await repository.update(property.id, property);
    
    if (!updatedProperty) {
      throw new BaseError({
        message: "Failed to update Property",
        statusCode: 500,
      });
    }

    return updatedProperty;
  }
}