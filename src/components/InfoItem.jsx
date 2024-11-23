import { Button } from "@headlessui/react";
import React from "react";
import { Link } from "react-router-dom";

const InfoItem = ({ title, text, ...props }) => {
  return (
    <div
      className="rounded-xl flex flex-col gap-5 w-full  bg-sky-600 py-12  text-lg text-white hover:bg-sky-500 cursor-pointer text-center duration-200 data-[active]:bg-sky-700"
      {...props}
    >
      <p className="font-bold text-2xl"> {title}</p>
      <p>{text}</p>
    </div>
  );
};

export default InfoItem;
