import { algoliasearch } from "algoliasearch";

export const algoliaClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_SEARCH_API_KEY,
);

export interface HardFilter {
  [key: string]: {
    type: string;
    value: string[];
  };
}

export const hardFilter: HardFilter = {
  sites: {
    type: "",
    value: ["US"],
  },
  prod_type: {
    type: "",
    value: ["frame", "reader"],
  },
};

export const generateFiltersByHardFilter = (hardFilter: HardFilter) => {
  return Object.keys(hardFilter)
    .map((filterKey) => {
      const orConditions = hardFilter[filterKey].value
        .map((value) => `${filterKey}:${value}`)
        .join(" OR ");
      return hardFilter[filterKey].value.length > 1
        ? `(${orConditions})`
        : orConditions;
    })
    .join(" AND ");
};

export const generateFacetFiltersByRefinementList = (
  refinementList?: Record<string, string[]>,
) => {
  if (!refinementList) return [];

  return Object.keys(refinementList).map((facetName) => {
    return refinementList[facetName].map((value) => `${facetName}:${value}`);
  });
};

// { a: ["v1", "v2"], b: ["v3", "v4"], c: ["v5"]}
// ==>
// [
//   {
//     facetFilters: [["b:v3", "b:v4"], ["c:v5"]],
//     facets: "a",
//   },
//   {
//     facetFilters: [["a:v1", "a:v2"], ["c:v5"]],
//     facets: "b",
//   },
//   {
//     facetFilters: [
//       ["a:v1", "a:v2"],
//       ["b:v3", "b:v4"],
//     ],
//     facets: "c",
//   },
// ];
export const generateFacetRequestByRefinementList = (
  refinementList?: Record<string, string[]>,
) => {
  if (!refinementList) return [];

  const refinementKeys = Object.keys(refinementList);

  return refinementKeys.map((currentFacetKey) => {
    const facetFilters = refinementKeys
      .filter((otherKey) => otherKey !== currentFacetKey)
      .map((otherKey) =>
        refinementList[otherKey].map((v) => `${otherKey}:${v}`),
      );

    if (facetFilters.length === 0) {
      return {
        facets: [currentFacetKey],
      };
    }

    return {
      facetFilters,
      facets: [currentFacetKey],
    };
  });
};

export const requestAlgolia = (options: {
  indexName: string;
  facets: string[];
  hardFilter: HardFilter;
  refinementList?: Record<string, string[]>;
}) => {
  const { indexName, facets, hardFilter, refinementList } = options;

  const filters = generateFiltersByHardFilter(hardFilter);
  const facetFilters = generateFacetFiltersByRefinementList(refinementList);
  const otherRequests = generateFacetRequestByRefinementList(refinementList);

  return algoliaClient.search([
    {
      indexName,
      params: {
        facetFilters,
        facets,
        filters,
        highlightPostTag: "__/ais-highlight__",
        highlightPreTag: "__ais-highlight__",
        maxValuesPerFacet: 50,
        ruleContexts: ["test"],
      },
    },
    ...otherRequests.map((req) => {
      return {
        indexName: indexName,
        params: {
          ...req,
          filters: filters,
          highlightPostTag: "__/ais-highlight__",
          highlightPreTag: "__ais-highlight__",
          maxValuesPerFacet: 50,
          hitsPerPage: 0,
          page: 0,
          analytics: false,
          clickAnalytics: false,
        },
      };
    }),
  ]);
};
