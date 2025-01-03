import React from "react";
import ReturnButton from "./ReturnButton";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReturnWithTitle = ({ title, classCustom, ...props }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`title-icon w-100 flex justify-between items-center flex-row-reverse container ${classCustom}`}
    >
      <ReturnButton />
      <div className="flex flex-row-reverse gap-2 justify-center items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <button onClick={() => navigate('/')}>
        <HomeIcon
          size={45}
          className="cursor-pointer hover:scale-110 duration-200"
        />
      </button>
      </div>
    </div>
  );
};

export default ReturnWithTitle;
