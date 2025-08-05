import { BaseQuery, BaseQueryHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { PropertyRepository } from "../../infrastructure/repositories";
import { Property } from "../../infrastructure/entities";


export class DiseablePropertyQuery extends BaseQuery {
  id: string;
  constructor(props: CommandProps<DiseablePropertyQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class DiseablePropertyQueryHandler extends BaseQueryHandler<DiseablePropertyQuery, Property> {
  async execute(query: DiseablePropertyQuery): Promise<Property> {
    const repository = PropertyRepository.getInstance();
    console.log('\n id actif => ', query.id)
    const property = await repository.findOneByWhithoutParamIsActive({id: query.id}, true);

    if (!property) {
      throw new BaseError({
        message: "property not found",
        statusCode: 404,
      });
    }

    property.isActive = false;

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