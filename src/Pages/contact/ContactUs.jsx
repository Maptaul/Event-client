import React, { useRef } from "react";

const ContactUs = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_b61stv6",
        "template_2wb0lnq",
        form.current,
        "xtAtvikhDkEgQbGPv"
      )
      .then(
        () => {
          Swal.fire({
            title: "Message Sent!",
            text: "Thank you for reaching out. I will get back to you soon.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#FFA500",
          });
          e.target.reset(); // Clear the form
        },
        (error) => {
          Swal.fire({
            title: "Oops!",
            text: `Something went wrong: ${error.text}`,
            icon: "error",
            confirmButtonText: "Try Again",
            confirmButtonColor: "#FF5733",
          });
        }
      );
  };
  return (
    <div className="p-8 w-11/12 mx-auto  rounded-lg shadow-md">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">
        Contact Us
      </h1>
      <p className="text-gray-100 mb-4 text-center">
        Have questions or need assistance? Reach out to us!
      </p>
      <div className="w-full md:w-1/2 mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Name</span>
            </label>
            <input
              type="text"
              name="user_name"
              placeholder="Enter your name"
              className="input input-bordered w-full text-black"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Email</span>
            </label>
            <input
              type="email"
              name="user_email"
              placeholder="Enter your email"
              className="input input-bordered w-full text-black"
              required
            />
          </div>

          {/* Message Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300">Message</span>
            </label>
            <textarea
              name="message"
              placeholder="Write your message"
              className="textarea textarea-bordered w-full text-black"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-primary w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
