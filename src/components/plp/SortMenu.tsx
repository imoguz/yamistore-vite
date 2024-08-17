import * as React from "react";

interface ISortMenuProps {
  sortMenu: ISortMenu;
  setSortMenu: React.Dispatch<React.SetStateAction<ISortMenu>>;
}
const SortMenu: React.FC<ISortMenuProps> = ({ sortMenu, setSortMenu }) => {
  const sortOptions: ISortOptions[] = [
    { title: "Featured", field: "", order: 1 },
    { title: "Newest", field: "createdAt", order: 1 },
    { title: "A - Z", field: "name", order: 1 },
    { title: "Z - A", field: "name", order: -1 },
    { title: "Price (high to low)", field: "price", order: -1 },
    { title: "Price (low to high)", field: "price", order: 1 },
  ];

  const handleSorting = (sortOption: ISortOptions) => {
    setSortMenu({
      open: false,
      selectedOption: sortOption.title,
      field: sortOption.field,
      order: sortOption.order,
    });
  };

  return (
    <div
      className={`absolute z-50 bg-white shadow-md w-max rounded-md shadow-gray-500 overflow-hidden  transition-height duration-200
        ${window.innerWidth >= 640 ? "right-0" : "left-0"} 
        ${sortMenu.open ? "h-52 py-2" : "h-0"} `}
    >
      {sortOptions.map((sortOption) => (
        <p
          key={sortOption.title}
          className="hover:bg-gray-200 px-3 py-1 cursor-pointer"
          onClick={() => handleSorting(sortOption)}
        >
          {sortOption.title}
        </p>
      ))}
    </div>
  );
};

export default SortMenu;
