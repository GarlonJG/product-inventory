import InventoryPage from "./InventoryPage";
import ItemModal from "./components/item/ItemModal"
import ProtectedRoute from "../../routes/ProtectedRoute";

export const inventoryRoutes = [
  {
    path: "/inventory",
    element: <InventoryPage />,
    children: [
      { index: true, element: null }, //Change element if more parts of inventory are added or it goes to an InventoryLayout
      { path: "new", element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <ItemModal />
      </ProtectedRoute>
      )},
      { path: ":id/edit", element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <ItemModal />
      </ProtectedRoute>
      )}
    ],
  },
];