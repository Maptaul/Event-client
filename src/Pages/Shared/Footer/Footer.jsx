import { Link } from "react-router-dom";
import finalLogo from "../../../assets/Finallogo.png";

const Footer = () => {
  return (
    <div>
      <footer className="footer p-10 w-11/12 mx-auto bg-[#080A1A]  text-primary-content">
        <div>
          <img className="w-20 h-20" src={finalLogo} alt="" />
          <h1 className="text-3xl font-bold">LearnBridge</h1>
          <p className="text-sm">
            Streamlining study sessions, resources, and collaboration for modern
            education.
          </p>
          <p>© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
        <div>
          <span className="footer-title">Quick Links</span>
          <Link className="link link-hover" to="/">
            Home
          </Link>
          <Link className="link link-hover" to="/allStudySessions">
            Study Sessions
          </Link>
          <Link className="link link-hover" to="/AllTutorSection">
            Tutors
          </Link>
          <a className="link link-hover" href="/dashboard">
            Dashboard
          </a>
        </div>
        <div>
          <span className="footer-title">Contact Us</span>
          <p>Email: maptaul912@gmail.com</p>
          <p>Phone: +8801846035436</p>
        </div>
        <div>
          <span className="footer-title">Follow Us</span>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://www.facebook.com/Maptaul/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12v-9.294H9.692v-3.622H12V8.413c0-2.265 1.354-3.501 3.422-3.501.985 0 1.828.073 2.074.106v2.407l-1.425.001c-1.116 0-1.333.531-1.333 1.31v1.719h2.667l-.348 3.622h-2.319V24h4.54c.732 0 1.325-.593 1.325-1.324V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/maptaul-islam-taraq/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M22.23 0H1.77C.79 0 0 .8 0 1.77v20.46C0 23.2.79 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0zM7.06 20.45H3.55V9.04h3.51v11.41zm-1.76-12.99c-1.14 0-2.06-.93-2.06-2.06s.92-2.06 2.06-2.06 2.06.93 2.06 2.06-.92 2.06-2.06 2.06zm15.67 12.99h-3.51v-5.64c0-1.35-.03-3.08-1.87-3.08-1.87 0-2.16 1.46-2.16 2.97v5.74h-3.51V9.04h3.37v1.56h.05c.47-.89 1.63-1.83 3.36-1.83 3.6 0 4.26 2.37 4.26 5.45v6.23z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
