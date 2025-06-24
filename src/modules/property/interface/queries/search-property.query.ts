import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyTypesenseService } from "@/modules/property/infrastructure/services/property-typesense.service";
import { SearchParams } from "typesense/lib/Typesense/Documents";

export class SearchPropertyQuery extends BaseQuery {
  query: any;

  constructor(props: QueryProps<SearchPropertyQuery>) {
    super(props);
    this.query = props.query;
  }
}

export class SearchPropertyQueryHandler extends BaseQueryHandler<SearchPropertyQuery, Property[]> {
  async execute(query: SearchPropertyQuery): Promise<Property[]> {
    const typesenseService = new PropertyTypesenseService();
    
    // Extract search parameters from the query
    const searchText = query.query?.q || "";
    
    // Build search parameters for Typesense
    const searchParams: SearchParams = {
      q: searchText,
      query_by: "name,description,address",
      sort_by: "_text_match:desc,updated_at:desc",
      per_page: 20
    };
    
    // Add filters if provided in the query
    if (query.query?.filter_by) {
      searchParams.filter_by = query.query.filter_by;
    }
    
    // Add faceting if needed
    if (query.query?.facet_by) {
      searchParams.facet_by = query.query.facet_by;
    }
    
    // Perform the search using the TypesenseService
    return await typesenseService.search(searchParams);
  }
}