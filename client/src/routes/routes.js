import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { inventoryRoutes } from "../features/inventory/InventoryRoutes";
import { loginRoutes } from "../features/login/LoginRoutes";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // Public auth routes
  ...loginRoutes,
  // Protected routes
 
  {
    element: <ProtectedRoute />,
    children: [
      ...inventoryRoutes,
      {
        path: "/",
        element: <Navigate to="/inventory" replace />
      },
     
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

export default router;