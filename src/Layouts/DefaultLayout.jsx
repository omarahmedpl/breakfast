import React from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="sm:min-h-[80vh] min-h-[95vh] sm:h-[100vh]">
      <div className="container flex w-full h-full flex-col justify-center items-center">
        <div className="flex flex-col items-center  my-5 sm:my-5  py-20 relative bg-[#25376BFF] w-[80%] rounded-lg ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
