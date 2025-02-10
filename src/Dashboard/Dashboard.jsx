import { useContext } from "react";
import { CiLogin } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { FaNoteSticky, FaUsers } from "react-icons/fa6";
import { IoBookmarksSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import finalLogo from "../../src/assets/Finallogo.png";
import useRole from "../Hooks/useRole";
import { AuthContext } from "../Providers/AuthProvider";

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const email = user?.email || null;
  const { role, loading } = useRole(email);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  const renderMenuItems = () => {
    switch (role) {
      case "student":
        return (
          <>
            <li>
              <NavLink to="/dashboard/ViewBookedSession">
                <IoBookmarksSharp /> View Booked Session
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/createNote">
                <LuNotebookPen /> Create Note
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ManagePersonalNotes">
                <FaNoteSticky /> Manage Notes
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ViewAllStudyMaterials">
                <FaNoteSticky /> All Study Materials
              </NavLink>
            </li>
          </>
        );
      case "tutor":
        return (
          <>
            <li>
              <NavLink to="/dashboard/createStudySession">
                <LuNotebookPen /> Create Study Session
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ViewAllStudySessions">
                <IoBookmarksSharp /> View All Sessions
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/UploadMaterials">
                <FaNoteSticky /> Upload Materials
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ViewAllMaterials">
                <FaNoteSticky /> View All Materials
              </NavLink>
            </li>
          </>
        );
      case "admin":
        return (
          <>
            <li>
              <NavLink to="/dashboard/ViewAllUsers">
                <FaUsers /> View All Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ViewAllStudySession">
                <IoBookmarksSharp /> View All Sessions
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/ViewAllMaterial">
                <FaNoteSticky /> View All Materials
              </NavLink>
            </li>
          </>
        );
      default:
        return (
          <li>
            <NavLink to="/">No Dashboard Access</NavLink>
          </li>
        );
    }
  };

  return (
    <div className="flex w-11/12 mx-auto">
      <div className="w-80 min-h-screen bg-[#D1A054]">
        <div className="p-2 mb-10 mt-5">
          <Link className="flex items-center gap-1" to="/">
            <img className="w-16 items-center" src={finalLogo} alt="" />
            <h1 className="text-3xl font-bold text-purple-600">LearnBridge</h1>
          </Link>
        </div>
        <div className="flex mb-10">
          <h2 className="text-xl p-2 font-bold text-white">
            {user?.displayName}
          </h2>
          <h2 className="text-xl p-2 text-orange-500">{role}</h2>
        </div>
        <ul className="menu p-4 text-xl font-bold gap-3">
          {renderMenuItems()}
          <div className="divider"></div>
          <li>
            <NavLink to="/" className="bg-[#e9e2e222]">
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink onClick={handleLogout} className="bg-[#e9e2e222]">
              <CiLogin /> Log Out
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
