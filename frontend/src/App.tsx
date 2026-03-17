import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouteObject,
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import PublicInvoice from "./pages/PublicInvoice";
import Receipts from "./pages/Receipts";
import ReceiptDetail from "./pages/ReceiptDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

const routes: RouteObject[] = [
  {
    path: "/invoice/public/:id",
    element: <PublicInvoice />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "clients", element: <Clients /> },
      { path: "invoices", element: <Invoices /> },
      { path: "invoices/new", element: <CreateInvoice /> },
      { path: "invoices/:id", element: <InvoiceDetail /> },
      { path: "receipts", element: <Receipts /> },
      { path: "receipts/:id", element: <ReceiptDetail /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
