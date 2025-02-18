import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer/Footer";
import NavBar from "../Pages/Shared/Navbar/NavBar";

const Main = () => {
  return (
    <div className="min-h-screen bg-[#080A1A] ">
      <NavBar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
