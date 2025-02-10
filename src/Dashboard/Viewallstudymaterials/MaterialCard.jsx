import React from "react";

const MaterialCard = ({ material }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = material.image; // The image URL
    link.download = "StudyMaterial.jpg"; // Default download name
    link.click();
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border p-4">
      <img src={material.image} alt="Material" className="w-full h-48" />
      <p className="text-center font-bold mt-4">Material ID: {material._id}</p>
      <a
        href={material.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline block text-center mt-2"
      >
        Open Google Drive Link
      </a>
      <button
        onClick={handleDownload}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded block mx-auto"
      >
        Download Image
      </button>
    </div>
  );
};

export default MaterialCard;
