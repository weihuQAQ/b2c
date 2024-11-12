import { RefinementCategory } from "./parts/RefinementCategory.tsx";

export function Filters({
  filters,
}: {
  filters: { attribute: string; label: string }[];
}) {
  return (
    <div className="tw-flex tw-flex-col tw-space-y-2 tw-p-4 max-md:tw-hidden">
      <span className="tw-text-2xl">filters</span>

      <div className="tw-flex tw-flex-col tw-space-y-6">
        {filters.map((filter) => (
          <div key={filter.attribute} className="tw-border-t">
            <span className="tw-border-y">{filter.label}</span>
            <RefinementCategory attribute={filter.attribute} />
          </div>
        ))}
      </div>
    </div>
  );
}
