import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import type { PropertyType } from "@/core/enums/enums";
import { PaginatedResponse } from "@/core/base/responses";

export class GetFeaturedPropertyQuery extends BaseQuery {
    type: PropertyType;
    page: number;
    limit: number;

    constructor(props: QueryProps<GetFeaturedPropertyQuery>) {
        super(props);
        this.type = props.type;
        this.page = props.page || 1;
        this.limit = props.limit || 10;
    }
}

export class GetFeaturedPropertyQueryHandler extends BaseQueryHandler<GetFeaturedPropertyQuery, PaginatedResponse<Property>> {
    async execute(query: GetFeaturedPropertyQuery): Promise<PaginatedResponse<Property>> {
        const repository = PropertyRepository.getInstance();
        const { items, total } = await repository.getFeaturedPropertiesByType(query.type, query.page, query.limit);
        
        return {
            items,
            total,
            page: query.page,
            limit: query.limit,
            last_page: Math.ceil(total / query.limit)
        };
    }
}