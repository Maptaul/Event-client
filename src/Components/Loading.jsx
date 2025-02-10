import React from "react";
import { RingLoader } from "react-spinners";

const Loading = ({ loading = true, size = 150, color = "#36D7B7" }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <RingLoader loading={loading} size={size} color={color} />
    </div>
  );
};

export default Loading;
