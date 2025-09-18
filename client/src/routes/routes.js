import { createBrowserRouter } from "react-router-dom";
import { inventoryRoutes } from "../features/inventory/InventoryRoutes";

const router = createBrowserRouter([
  ...inventoryRoutes
]);

export default router;