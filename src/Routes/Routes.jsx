import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../../src/Dashboard/Dashboard";
import Main from "../Layouts/Main";
import ErrorPage from "../Pages/Error/ErrorPage";
import Home from "../Pages/Home/Home/Home";
import AllStudySessions from "../Pages/Home/StudySessions/AllStudySessions";
import StudySessionDetails from "../Pages/Home/StudySessions/StudySessionDetails";
import AllTutorSection from "../Pages/Home/TutorSection/AllTutorSection";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";

import ViewAllMaterial from "../Dashboard/admin/ViewAllMaterials/ViewAllMaterial";
import ViewAllStudySession from "../Dashboard/admin/ViewAllStudySessions/ViewAllStudySession";
import ViewAllUsers from "../Dashboard/admin/ViewAllUsers/ViewAllUsers";
import CreateNote from "../Dashboard/createNote/CreateNote";
import ManagePersonalNotes from "../Dashboard/ManagePersonalNotes/ManagePersonalNotes";
import Payment from "../Dashboard/payment/Payment";
import CreateStudySession from "../Dashboard/tutor/CreateStudySession/CreateStudySession";
import UploadMaterials from "../Dashboard/tutor/UploadMaterials/UploadMaterials";
import ViewAllMaterials from "../Dashboard/tutor/ViewAllMaterials/ViewAllMaterials";
import ViewAllStudySessions from "../Dashboard/tutor/ViewAllStudySessions/ViewAllStudySessions";
import ViewAllStudyMaterials from "../Dashboard/Viewallstudymaterials/ViewAllStudyMaterials";
import SessionDetails from "../Dashboard/ViewBookedSession/SessionDetails";
import ViewBookedSession from "../Dashboard/ViewBookedSession/ViewBookedSession";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ContactUs from "../Pages/contact/ContactUs";
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
        path: "sessions/:id",
        element: (
          <PrivetRoute>
            <StudySessionDetails />
          </PrivetRoute>
        ),
      },
      {
        path: "allStudySessions",
        element: <AllStudySessions />,
      },
      {
        path: "AllTutorSection",
        element: <AllTutorSection />,
      },
      {
        path: "aboutUs",
        element: (
          <PrivetRoute>
            <AboutUs />
          </PrivetRoute>
        ),
      },
      {
        path: "contact",
        element: (
          <PrivetRoute>
            <ContactUs />
          </PrivetRoute>
        ),
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "payment/:id",
        element: <Payment />,
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
    path: "dashboard",
    element: (
      <PrivetRoute>
        <Dashboard />
      </PrivetRoute>
    ),
    children: [
      {
        path: "/dashboard/ViewBookedSession",
        element: <ViewBookedSession />,
      },
      {
        path: "/dashboard/createNote",
        element: <CreateNote />,
      },
      {
        path: "/dashboard/ManagePersonalNotes",
        element: <ManagePersonalNotes />,
      },
      {
        path: "/dashboard/ViewAllStudyMaterials",
        element: <ViewAllStudyMaterials />,
      },
      {
        path: "/dashboard/createStudySession",
        element: <CreateStudySession />,
      },
      {
        path: "/dashboard/ViewAllStudySessions",
        element: <ViewAllStudySessions />,
      },
      {
        path: "/dashboard/UploadMaterials",
        element: <UploadMaterials />,
      },
      {
        path: "/dashboard/ViewAllMaterials",
        element: <ViewAllMaterials />,
      },
      {
        path: "/dashboard/ViewAllUsers",
        element: <ViewAllUsers />,
      },
      {
        path: "/dashboard/ViewAllStudySession",
        element: <ViewAllStudySession />,
      },
      {
        path: "/dashboard/ViewAllMaterial",
        element: <ViewAllMaterial />,
      },
      {
        path: "/dashboard/sessionDetails/:id",
        element: (
          <PrivetRoute>
            <SessionDetails />
          </PrivetRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);
