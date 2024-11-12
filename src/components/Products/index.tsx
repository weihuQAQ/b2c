import { useHits } from "react-instantsearch";

export function Products() {
  const { items, results } = useHits();
  return (
    <div>
      <div>{results?.nbHits}</div>

      <div className="tw-grid tw-grid-cols-3 tw-gap-4 grid-flow-col">
        {items.map((item) => (
          <div key={item.objectID} className="">
            <img src={item.sku_image_url} alt="" />
            <div>{item.prod_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
