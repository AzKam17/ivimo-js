import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";

export class GetRecommendedPropertyQuery extends BaseQuery{
    id: string;

    constructor(props: QueryProps<GetRecommendedPropertyQuery>){
        super(props);
        this.id = props.id;
    }
}

export class GetRecommendedPropertyQueryHandler extends BaseQueryHandler<GetRecommendedPropertyQuery, Property[]>{
    async execute(query: GetRecommendedPropertyQuery): Promise<Property[]> {
        const repository = PropertyRepository.getInstance();
        return await repository.getRecommendedPropertiesWithinRadius(query.id);
    }
}