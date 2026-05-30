import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "./rudex/store/profileSlice";
import { AppRoutes } from "./AppRoutes/AppRoutes.jsx";
import './App.css'
import { Suspense } from "react";
import Loading from "./components/loading.jsx";
import Toast from "./components/Toast.jsx";
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      dispatch(getUser());
    }
  }, [dispatch]);
  return (
    <Suspense fallback={<Loading/>}>
      <Toast />
      <RouterProvider router={AppRoutes} />
    </Suspense>
  )
}