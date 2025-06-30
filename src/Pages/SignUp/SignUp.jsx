import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import registrationLottie from "../../assets/lottie/register.json";
import { AuthContext } from "../../Providers/AuthProviderNew";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const navigate = useNavigate();

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
    // Name validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    // PhotoURL validation (optional but if provided, should be valid URL)
    if (formData.photoURL.trim() && !/^https?:\/\/.+/.test(formData.photoURL)) {
      setError(
        "Please enter a valid photo URL (starting with http:// or https://)"
      );
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await createUser(
        formData.email,
        formData.password,
        formData.name,
        formData.photoURL
      );

      Swal.fire({
        title: "Registration Successful!",
        text: `Welcome to Event Manager, ${formData.name}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      // Handle custom auth errors
      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        switch (error.message) {
          case "Email and password are required":
            errorMessage = "Please fill in all required fields.";
            break;
          case "Invalid email format":
            errorMessage = "Please enter a valid email address.";
            break;
          case "An account with this email already exists":
            errorMessage =
              "This email is already registered. Please use a different email or try logging in.";
            break;
          case "Password must be at least 6 characters long":
          case "Password must contain at least one uppercase letter":
          case "Password must contain at least one lowercase letter":
            errorMessage = error.message;
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

  return (
    <div className="min-h-screen md:flex justify-center items-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="text-center lg:text-left w-96">
        <Lottie animationData={registrationLottie}></Lottie>
      </div>

      <div className="card bg-white w-full max-w-lg p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8">Join Event Manager today</p>

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
          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name *</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email Address *</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="input input-bordered w-full pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Must be at least 6 characters with uppercase and lowercase
                letters
              </span>
            </label>
          </div>

          {/* Photo URL Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Profile Photo URL (Optional)
              </span>
            </label>
            <input
              name="photoURL"
              type="url"
              placeholder="https://example.com/your-photo.jpg (leave empty if none)"
              className="input input-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.photoURL}
              onChange={handleInputChange}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Optional: URL to your profile picture. You can skip this field.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className={`btn btn-primary w-full text-lg ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
