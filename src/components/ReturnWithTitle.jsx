import React from "react";
import ReturnButton from "./ReturnButton";

const ReturnWithTitle = ({ title, classCustom, ...props }) => {
  return (
    <div
      className={`title-icon w-100 flex justify-between items-center flex-row-reverse container ${classCustom}`}
    >
      <ReturnButton />
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default ReturnWithTitle;
