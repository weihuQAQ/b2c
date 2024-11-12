import { useEffect, useMemo } from "react";
import { useInstantSearch } from "react-instantsearch";
import { Button, Drawer } from "@mui/material";
import { Close } from "@mui/icons-material";

import { hardFilter, requestAlgolia } from "../../utils/algolia.ts";
import { RefinementCategory } from "./parts/RefinementCategory.tsx";

export interface MobileFiltersProps {
  filters: { attribute: string; label: string }[];
  open: boolean;
  onClose: () => void;
}

export function MobileFilters({ open, onClose, filters }: MobileFiltersProps) {
  const instantSearch = useInstantSearch();

  const facets = useMemo(
    () => filters.map((value) => value.attribute),
    [filters],
  );

  useEffect(() => {
    requestAlgolia({
      indexName: import.meta.env.VITE_SEARCH_INDEX,
      facets,
      hardFilter: hardFilter,
      refinementList: instantSearch.indexUiState.refinementList,
    }).then((res) => {
      console.log(res);
    });
  }, [facets, instantSearch.indexUiState.refinementList]);

  return (
    <Drawer open={open} onClose={onClose} keepMounted>
      <div className="tw-space-y-4 tw-py-4 tw-flex tw-flex-col tw-max-h-full tw-relative tw-overflow-hidden">
        <div className="mobile-filter-header tw-flex tw-justify-between tw-items-center tw-px-4">
          <span>Filters</span>
          <Button variant="outlined" onClick={onClose}>
            <Close />
          </Button>
        </div>

        <div className="tw-flex tw-flex-col tw-space-y-6 tw-max-h-full tw-overflow-auto scroll-thin tw-pl-4 tw-pr-2">
          {filters.map((filter) => (
            <div key={filter.attribute} className="tw-border-t">
              <span className="tw-border-y">{filter.label}</span>
              <RefinementCategory attribute={filter.attribute} />
            </div>
          ))}
        </div>

        <div className="mobile-filter-footer tw-flex tw-justify-between tw-items-center tw-px-4">
          <Button variant="outlined" color="error">
            Clear
          </Button>

          <Button variant="contained" onClick={onClose}>
            Apply
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
