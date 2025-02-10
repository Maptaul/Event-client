import React from "react";
import MaterialCard from "./MaterialCard";

const MaterialList = ({ materials }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {materials.length > 0 ? (
        materials.map((material) => (
          <MaterialCard key={material._id} material={material} />
        ))
      ) : (
        <p>No materials available.</p>
      )}
    </div>
  );
};

export default MaterialList;
