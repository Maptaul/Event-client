import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import Loading from "../../Components/Loading"; // Assuming this component is implemented
import useAuth from "../../hooks/useAuth";

const ManagePersonalNotes = () => {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state for notes fetching

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true); // Start loading when the fetch begins
      try {
        const response = await fetch(
          `https://learn-bridge-server-two.vercel.app/notes/${user?.email}`
        );
        const data = await response.json();

        if (response.ok) {
          setNotes(data);
        } else {
          Swal.fire("Error", "Failed to fetch notes.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while fetching notes.", "error");
      } finally {
        setLoading(false); // Stop loading when the fetch is complete
      }
    };

    if (user?.email) {
      fetchNotes();
    }
  }, [user?.email]);

  const handleUpdate = async (noteId) => {
    if (
      !editingNote ||
      editingNote.title.trim() === "" ||
      editingNote.description.trim() === ""
    ) {
      Swal.fire("Warning", "Title and description cannot be empty!", "warning");
      return;
    }

    try {
      const response = await fetch(
        `https://learn-bridge-server-two.vercel.app/notes/update/${noteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingNote),
        }
      );

      if (response.ok) {
        const updatedNoteData = await response.json();
        Swal.fire("Success", "Note updated successfully!", "success");

        // Merge updated note with existing ones
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? updatedNoteData.updatedNote : note
          )
        );

        // Reset editingNote state
        setEditingNote(null);
      } else {
        Swal.fire("Error", "Failed to update the note.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while updating the note.", "error");
    }
  };

  const handleDelete = async (noteId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          `https://learn-bridge-server-two.vercel.app/notes/delete/${noteId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          Swal.fire("Deleted!", "Your note has been deleted.", "success");

          setNotes((prevNotes) =>
            prevNotes.filter((note) => note._id !== noteId)
          );
        } else {
          Swal.fire("Error", "Failed to delete the note.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the note.",
          "error"
        );
      }
    }
  };

  if (authLoading || loading) return <Loading />; // Show loading when data or authentication is loading

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl text-center font-bold mb-8">Manage Your Notes</h1>

      {/* Notes List */}
      <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p className="text-gray-600 text-center">No notes available.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {note.title}
              </h3>
              <div
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{ __html: note.description }}
              ></div>

              {note.updatedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Last updated at: {new Date(note.updatedAt).toLocaleString()}
                </p>
              )}

              {note.previousVersions && note.previousVersions.length > 0 && (
                <details className="mt-4">
                  <summary className="text-blue-600 cursor-pointer">
                    View Previous Versions
                  </summary>
                  {note.previousVersions.map((prev, index) => (
                    <div
                      key={index}
                      className="mt-2 p-2 border rounded bg-gray-100"
                    >
                      <h4 className="font-semibold">{prev.title}</h4>
                      <div
                        dangerouslySetInnerHTML={{ __html: prev.description }}
                      ></div>
                      <p className="text-xs text-gray-500">
                        Updated at: {new Date(prev.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </details>
              )}

              <div className="flex justify-around mt-4">
                <button
                  onClick={() => setEditingNote({ ...note })}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingNote._id);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  className="input input-bordered w-full border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <ReactQuill
                  value={editingNote.description}
                  onChange={(value) =>
                    setEditingNote({ ...editingNote, description: value })
                  }
                  className="bg-white"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingNote(null)}
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePersonalNotes;
