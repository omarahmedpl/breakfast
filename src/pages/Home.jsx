import React from "react";
import PageItem from "../components/PageItem";
import { motion } from "motion/react";
import { Spinner } from "flowbite-react";
const Home = () => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  if (loading)
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
        className="loading flex flex-col gap-5 justify-center items-center h-full w-full px-10 xl:px-32"
      >
        <Spinner size="xl" />
        <div className="text-2xl font-bold">جاري التحميل...</div>
      </motion.div>
    );
  return (
    <motion.div
      key="main-content"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          default: { type: "spring", stiffness: 70, duration: 0.8 },
          opacity: { type: "spring", stiffness: 70, duration: 1 },
        },
      }}
      className="flex flex-col md:gap-16 sm:gap-8 gap-0 items-center  h-full w-full px-10 xl:px-32 "
    >
      <h1 className="sm:text-3xl xs:text-2xl text-xl font-bold">الصفحة الرئيسية</h1>
      <div className="grid lg:grid-cols-3 grid-cols-1 mt-8 sm:mt-0 gap-5 items-center justify-center ">
        <PageItem text="المطاعم" to="/restaurants" />
        <PageItem text="الطلبات" to="/orders" />
        <PageItem text="الوجبات" to="/items" />
      </div>
    </motion.div>
  );
};

export default Home;
