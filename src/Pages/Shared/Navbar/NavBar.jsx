import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../src/Providers/AuthProviderNew";
import finalLogo from "../../../assets/Finallogo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, email, logOut } = useContext(AuthContext);
  const navOptions = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to="/add-event">Add Event</Link>
      </li>
      <li>
        <Link to="/my-events">MY Event</Link>
      </li>
    </>
  );

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <div className="navbar sticky top-0 z-10 w-11/12 mx-auto bg-[#080A1A] bg-opacity-30 text-primary-content mb-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#080A1A] rounded-box z-[1] mt-3 w-52 p-2 shadow text-xl"
            >
              {/* add TODO: */}
              {navOptions}
            </ul>
          </div>
          <Link to="/" className=" font-bold text-2xl">
            <div className="flex items-center">
              <img className="w-16 h-16" src={finalLogo} alt="" />
              <h2 className="text-3xl font-bold">Event Manager</h2>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            {/* add TODO: */}
            {navOptions}
          </ul>
        </div>
        <div className="navbar-end gap-2 flex items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/150"}
                      alt="User"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-[#080A1A] text-white rounded-box shadow mt-3 w-auto p-4"
                >
                  <li className="text-center mb-2 rounded-md bg-[#e9e2e222] pointer-events-none">
                    <span className="text-white font-medium">
                      {user.displayName || user.email || "User"}
                    </span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="bg-[#e9e2e222]">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary rounded-md px-8 text-xl"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
