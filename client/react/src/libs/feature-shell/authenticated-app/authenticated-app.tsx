import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Homepage, MyHotels, MyReservations } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/my-hotels",
    element: <MyHotels />,
  },
  {
    path: "/my-reservations",
    element: <MyReservations />,
  },
]);

export function AuthenticatedApp() {
  return <RouterProvider router={router} />;
}
