import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import PublicRoute from "../authPages/PublicRoute.jsx";
import GuestRoute from "../authPages/GuestRoute.jsx";
import ProtectedRoute from "../authPages/ProtectedRoute.jsx";

import ErrorPage from "../components/Error.jsx";

// Auth
const Login = lazy(() => import("../pages/LoginPage/login.jsx"));
const Register = lazy(() => import("../pages/LoginPage/register.jsx"));
const ResetPassword = lazy(() => import("../pages/LoginPage/resestPassword.jsx"));

// Admin
const Dashboard = lazy(() => import("../pages/Admin/Dashboard.jsx"));
const AdminHome = lazy(() => import("../pages/Admin/AdminHome.jsx"));
const Prodects = lazy(() => import("../pages/Admin/Prodects.jsx"));
const AddProdect = lazy(() => import("../pages/Admin/AddProdect.jsx"));
const EditProdect = lazy(() => import("../pages/Admin/EditProdect.jsx"));
const ViewProdect = lazy(() => import("../pages/Admin/ViewProdect.jsx"));
const Ordersadmin = lazy(() => import("../pages/Admin/Orders.jsx"));
const Users = lazy(() => import("../pages/Admin/Users.jsx"));
const OrderDetails = lazy(() => import("../pages/Admin/OrderDetails.jsx"));
// User
const Header = lazy(() => import("../pages/User/Header.jsx"));
const Home = lazy(() => import("../pages/User/Home.jsx"));
const Checkout = lazy(() => import("../pages/User/Checkout.jsx"));
const Cart = lazy(() => import("../pages/User/Cart.jsx"));
const Product = lazy(() => import("../pages/User/Product.jsx"));
const Orders = lazy(() => import("../pages/User/orders.jsx"));
const Deals = lazy(() => import("../pages/User/Deals.jsx"));
const Games = lazy(() => import("../pages/User/Games.jsx"));

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },

  {
    path: "/home",
    element: (
      <GuestRoute>
        <Header />
      </GuestRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <Product />,
      },
    ],
  },

  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/deals",
    element: <Deals />,
  },
  {
    path: "/games",
    element: <Games />,
  },
  {
    path: "/Checkout",
    element: <Checkout />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "products",
        element: <Prodects />,
      },
      {
        path: "products/add",
        element: <AddProdect />,
      },
      {
        path: "products/edit/:id",
        element: <EditProdect />,
      },
      {
        path: "products/view/:id",
        element: <ViewProdect />,
      },
      {
        path: "orders",
        element: <Ordersadmin />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);