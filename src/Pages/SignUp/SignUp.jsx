import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import registrationLottie from "../../assets/lottie/register.json";
import { AuthContext } from "../../Providers/AuthProvider";

const SignUp = () => {
  const { createUser, googleSignIn, updateUserProfile, githubSignIn } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Password validation function
  const validatePassword = (password) => {
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const minLength = 6;

    if (!upperCase.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!lowerCase.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (password.length < minLength) {
      return "Password must be at least 6 characters long.";
    }
    return true;
  };

  // Handle standard registration
  const onSubmit = async (data) => {
    const { name, email, photo, password, role } = data;

    try {
      // Create user with Firebase
      const userCredential = await createUser(email, password);
      const createdUser = userCredential.user;

      // Update user profile
      await updateUserProfile(name, photo);

      // Save user data to the database
      const newUser = {
        name,
        email,
        photo,
        role,
        createdAt: new Date().toISOString(),
      };
      const response = await fetch(
        "https://learn-bridge-server-two.vercel.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        console.log("user added to the database");
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User created successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Error during registration. Please try again.");
    }
  };

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await googleSignIn();
      const user = result.user;

      if (user) {
        // Extract user data
        const { displayName: name, email, photoURL: photo } = user;

        // Prepare user data
        const newUser = {
          name,
          email,
          photo,
          role: "student", // Default role; adjust as needed
          createdAt: new Date().toISOString(),
        };

        // Save user data to the database
        const response = await fetch(
          "https://learn-bridge-server-two.vercel.app/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }
        );

        if (response.ok) {
          toast.success("Google sign-in successful and data saved!");
          navigate("/");
        } else {
          throw new Error("Failed to save user data.");
        }
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Error during Google sign-in. Please try again.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      // Sign in with GitHub
      const result = await githubSignIn();
      const user = result.user;

      if (user) {
        // Extract user data
        const name = user.displayName || "GitHub User";
        const email = user.email || null; // GitHub email may be null
        const photo = user.photoURL || "https://via.placeholder.com/150";

        // Ensure email is present
        if (!email) {
          toast.error(
            "GitHub account email is not available. Please use another method."
          );
          return;
        }

        // Prepare user data
        const newUser = {
          name,
          email,
          photo,
          role: "student",
          createdAt: new Date().toISOString(),
        };

        // Save user data to the database
        const response = await fetch(
          "https://learn-bridge-server-two.vercel.app/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }
        );

        const responseData = await response.json();
        console.log("📩 Server Response:", responseData);

        if (response.ok) {
          toast.success("✅ User registered successfully!");
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User created successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        } else {
          toast.error(`❌ Error: ${responseData.message}`);
        }
      }
    } catch (error) {
      console.error("GitHub Login Error:", error);
      toast.error("Error during GitHub sign-in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen md:flex justify-center items-center mb-10">
      <div className="text-center lg:text-left w-96">
        <Lottie animationData={registrationLottie} loop />
      </div>
      <div className="card bg-base-100 w-full max-w-lg shrink-0 rounded-md p-10 text-black">
        <h2 className="text-2xl font-semibold text-center">
          Register Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Name</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Photo Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Photo URL</span>
            </label>
            <input
              type="text"
              placeholder="Photo URL"
              className="input input-bordered"
              {...register("photo", { required: "Photo URL is required" })}
            />
            {errors.photo && (
              <span className="text-red-500 text-sm">
                {errors.photo.message}
              </span>
            )}
          </div>

          {/* Role Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Select Role</span>
            </label>
            <select
              className="select select-bordered"
              {...register("role", { required: "Role selection is required" })}
            >
              <option value="" disabled>
                Choose your role
              </option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <span className="text-red-500 text-sm">
                {errors.role.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full"
                {...register("password", {
                  validate: validatePassword,
                })}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary rounded-md">
              Register
            </button>
          </div>
        </form>

        {/* Google Login Button */}
        <div className="text-center mt-4">
          <button onClick={handleGoogleLogin} className="btn btn-outline mr-2">
            <FaGoogle className="mr-2" /> Register with Google
          </button>
          <button onClick={handleGithubLogin} className="btn btn-outline">
            <FaGithub className="mr-2" /> Register with Github
          </button>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-black font-semibold mt-5">
          Already have an account?{" "}
          <Link className="text-red-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
