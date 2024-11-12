import { useRefinementList } from "react-instantsearch";
import { Checkbox, FormControlLabel } from "@mui/material";

export interface RefinementCategoryUIProps {
  items: { value: string; label: string; isRefined: boolean; count: number }[];
  refine: (value: string) => void;
}

export function RefinementCategoryUI({
  items,
  refine,
}: RefinementCategoryUIProps) {
  return (
    <div className="tw-flex tw-flex-col tw-items-start tw-space-y-2">
      {items.map((item) => (
        <FormControlLabel
          key={item.value}
          checked={item.isRefined}
          onChange={() => refine(item.value)}
          control={<Checkbox />}
          label={
            <span className="tw-flex tw-justify-center tw-items-center tw-whitespace-nowrap">
              <span>
                {item.label} ({item.count})
              </span>
            </span>
          }
        />
      ))}
    </div>
  );
}

export interface RefinementCategoryProps {
  attribute: string;
}

export function RefinementCategory({ attribute }: RefinementCategoryProps) {
  const { refine, items } = useRefinementList({
    attribute,
    limit: 50,
    sortBy: ["count"],
  });

  return <RefinementCategoryUI items={items} refine={refine} />;
}
