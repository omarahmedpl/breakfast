import { Button } from "@headlessui/react";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const PageItem = ({ text, to = "No", left = true, ...props }) => {
  return to === "No" ? (
    <motion.div
      initial={{ opacity: 0, x: left ? 500 : -500 }} // x controls horizontal position
      animate={{ opacity: 1, x: 10 }} // Animate to visible and centered
      transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
      className="relative"
    >
      <Button
        className="rounded-xl w-full font-bold bg-sky-600 py-12 sm:px-24 px-10 text-lg text-white data-[hover]:bg-sky-500 duration-200 data-[active]:bg-sky-700"
        {...props}
      >
        {text}
      </Button>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 ,x: left ? 500 : -500}}
      animate={{ opacity: 1 , x:10}}
      transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
    >
      <Link {...props} to={to}>
        <Button className="rounded-xl w-full font-bold bg-sky-600 py-12 sm:px-24 px-10 text-lg text-white data-[hover]:bg-sky-500 duration-200 data-[active]:bg-sky-700">
          {text}
        </Button>
      </Link>
    </motion.div>
  );
};

export default PageItem;
