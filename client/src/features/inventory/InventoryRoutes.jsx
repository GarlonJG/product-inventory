import InventoryPage from "./InventoryPage";
import ItemModal from "./components/item/ItemModal"

export const inventoryRoutes = [
  {
    path: "/", //using this as a catch all for now
    element: <InventoryPage />,
    children: [
      { index: true, element: null }, //Change element if more parts of inventory are added or it goes to an InventoryLayout
      { path: "new", element: <ItemModal /> },
      { path: ":id/edit", element: <ItemModal /> }
    ],
  },
];