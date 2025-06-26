import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { MaterialsTypesenseService } from "@/modules/materials/infrastructure/services/materials-typesense.service";
import { SearchParams } from "typesense/lib/Typesense/Documents";
import { PaginatedResponse } from "@/core/base/responses";

export class SearchMaterialsQuery extends BaseQuery {
  query: any;

  constructor(props: QueryProps<SearchMaterialsQuery>) {
    super(props);
    this.query = props.query;
  }
}

export class SearchMaterialsQueryHandler extends BaseQueryHandler<SearchMaterialsQuery, PaginatedResponse<Materials>> {
  async execute(query: SearchMaterialsQuery): Promise<PaginatedResponse<Materials>> {
    const typesenseService = new MaterialsTypesenseService();

    // Extract search parameters from the query
    const searchText = query.query?.q || "";
    const page = parseInt(query.query?.page) || 1;
    const limit = parseInt(query.query?.limit) || 20;

    // Build search parameters for Typesense
    const searchParams: SearchParams = {
      q: searchText,
      query_by: "name,description,category_slug",
      sort_by: "_text_match:desc,updated_at:desc",
      per_page: limit,
      page,
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
    return await typesenseService.searchWithPagination(searchParams);
  }
}