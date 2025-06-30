import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import AddEvent from "../Pages/AddEvent/AddEvent";
import ErrorPage from "../Pages/Error/ErrorPage";
import Events from "../Pages/Events/Events";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Login/Login";
import MyEvents from "../Pages/MyEvents/MyEvents";
import SignUp from "../Pages/SignUp/SignUp";
import PrivetRoute from "./PrivetRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "events",
        element: (
          <PrivetRoute>
            <Events />
          </PrivetRoute>
        ),
      },
      {
        path: "add-event",
        element: (
          <PrivetRoute>
            <AddEvent />
          </PrivetRoute>
        ),
      },
      {
        path: "my-events",
        element: (
          <PrivetRoute>
            <MyEvents />
          </PrivetRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signUp",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
