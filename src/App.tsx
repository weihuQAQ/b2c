import { useMemo, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch";
import { Button } from "@mui/material";

import { Filters } from "./components/Filters";
import { Products } from "./components/Products";
import { MobileFilters } from "./components/Filters/MobileFilters.tsx";
import {
  algoliaClient,
  generateFiltersByHardFilter,
  hardFilter,
} from "./utils/algolia.ts";

const filters = [
  { attribute: "prod_gender", label: "Gender" },
  { attribute: "sku_color", label: "Color" },
  { attribute: "prod_brand", label: "Brands" },
  { attribute: "prod_comfort", label: "Comfort" },
];

function App() {
  const [mobileFilterVisible, setMobileFilterVisible] =
    useState<boolean>(false);

  const joinDefaultFilters = useMemo(
    () => generateFiltersByHardFilter(hardFilter),
    [],
  );

  return (
    <div className="tw-space-y-4">
      <header>
        <h2 className="tw-text-8xl">Header</h2>
      </header>

      <main>
        <div className="tw-flex tw-space-x-4">
          <InstantSearch
            searchClient={algoliaClient}
            indexName={import.meta.env.VITE_SEARCH_INDEX}
          >
            {/* Hard filters */}
            <Configure filters={joinDefaultFilters} />
            <Filters filters={filters} />
            <MobileFilters
              filters={filters}
              open={mobileFilterVisible}
              onClose={() => setMobileFilterVisible(false)}
            />
            <div className="tw-p-4">
              <Button
                variant="outlined"
                onClick={() => setMobileFilterVisible(true)}
              >
                Filters
              </Button>
              <Products />
            </div>
          </InstantSearch>
        </div>
      </main>

      <footer className="tw-text-8xl">footer</footer>
    </div>
  );
}

export default App;
