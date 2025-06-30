import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginLottie from "../../assets/lottie/login.json";
import { AuthContext } from "../../Providers/AuthProviderNew";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      const user = result.user;

      Swal.fire({
        title: "Login Successful",
        text: `Welcome back, ${user.displayName || user.email}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      // Handle custom auth errors
      let errorMessage = "Login failed. Please try again.";

      if (error.message) {
        switch (error.message) {
          case "Email and password are required":
            errorMessage = "Please fill in all required fields.";
            break;
          case "Invalid email format":
            errorMessage = "Please enter a valid email address.";
            break;
          case "Invalid email or password":
            errorMessage = "Incorrect email or password. Please try again.";
            break;
          default:
            errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await googleSignIn();
      const user = result.user;

      Swal.fire({
        title: "Login Successful",
        text: `Welcome, ${user.displayName || user.email}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      const result = await githubSignIn();
      const user = result.user;

      Swal.fire({
        title: "Login Successful",
        text: `Welcome, ${user.displayName || user.email}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("GitHub login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center lg:text-left w-96">
        <Lottie animationData={loginLottie}></Lottie>
      </div>

      <div className="card bg-white w-full max-w-lg p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please sign in to your account
        </p>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email Address *</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Password *</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className={`btn btn-primary w-full text-lg ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider my-6">OR</div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full"
            disabled={loading}
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="btn btn-outline w-full"
            disabled={loading}
          >
            <FaGithub className="mr-2" />
            Continue with GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
