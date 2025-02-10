import axios from "axios";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const CreateNote = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (image) {
        const imgData = new FormData();
        imgData.append("image", image);

        const imgResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${image_hosting_key}`,
          imgData
        );

        imageUrl = imgResponse.data.data.display_url;
      }

      const note = {
        email: user?.email,
        title,
        description,
        image: imageUrl,
      };

      const response = await fetch(
        "https://learn-bridge-server-two.vercel.app/createNote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(note),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({ icon: "success", title: "Note Created!" });
        setTitle("");
        setDescription("");
        setImage(null);
        setCreatedAt(data.note.createdAt);
      } else {
        Swal.fire({ icon: "error", title: "Error!", text: data.message });
      }
    } catch (error) {
      console.error("Error creating note:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred.",
      });
    }
  };

  return (
    <div className="container mx-auto mt-10 space-y-5">
      <h1 className="text-2xl text-center font-bold mb-6">
        Create a New Personal Note
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-base-200 p-6 shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="mb-10">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Enter note description"
            className="bg-white h-64"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "link",
              "image",
            ]}
          />
        </div>

        <div className="mb-4 mt-10">
          <label className="block text-gray-700 font-medium mb-2 mt-10">
            Upload Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-10">
          Create Note
        </button>
      </form>

      {createdAt && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Created At: {new Date(createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default CreateNote;
