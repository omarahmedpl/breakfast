import React, { useEffect, useState } from "react";
import PageItem from "../../components/PageItem";
import ReturnButton from "../../components/ReturnButton";
import { createPortal } from "react-dom";
import Modal from "../../components/Modal";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { motion } from "motion/react"
import ReturnWithTitle from "../../components/ReturnWithTitle";
const Restaurants = () => {
  const [loadingAdd, setLoadingAdd] = useState(false);
  const formik = useFormik({
    initialValues: {
      rest_name: "",
    },
    validateOnMount: true,
    onReset: () => {
      formik.setValues({ rest_name: "" });
    },
    validationSchema: yup.object({
      rest_name: yup.string().required("اسم المطعم مطلوب"),
    }),
    onSubmit: async (values) => {
      setLoadingAdd(true);
      const data = await axios.post(
        `${import.meta.env.VITE_BASE_URL}restaurants`,
        values
      );
      if (data.status === 200 || data.status === 201) {
        console.log(data.data);

        setTimeout(() => {
          setLoadingAdd(false);
          closeModal();
          toast.success("تم اضافة المطعم بنجاح");
        }, 1000);
      } else {
        toast.error("حدث خطأ ما");
        setTimeout(() => {
          setLoadingAdd(false);
        }, 1000);
      }
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
    formik.resetForm({ values: { rest_name: "" } }); // Ensure form resets properly
  };
  const closeModal = () => {
    formik.resetForm({ values: { rest_name: "" } }); // Ensure form resets properly
    setIsOpen(false);
  };
  return (
    <motion.div
    key="loading"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
    className="flex flex-col md:gap-16 gap-8 mt-[-50px] h-full w-full px-10 xl:px-32 ">
      <ToastContainer
               className="px-5 sm:px-0"

        position="bottom-center"
        hideProgressBar={true}
        draggable={true}
      />
      <ReturnWithTitle title="المطاعم" />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5  w-full ">
        <PageItem left={true} text="عرض جميع المطاعم" to="/restaurants/all" />
        <PageItem left={false} text="اضافة مطعم جديد" to="No" onClick={openModal} />
      </div>
      {createPortal(
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="إضافة مطعم جديد">
          <form
            onSubmit={formik.handleSubmit}
            className="flex w-full flex-col my-4 text-black p-5"
          >
            <div>
              <div className="mb-2 block">
                <Label
                  className="text-black font-bold"
                  htmlFor="rest_name"
                  value="اسم المطعم"
                />
              </div>
              <TextInput
                id="rest_name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.rest_name}
                name="rest_name"
                onBlur={formik.handleBlur}
                placeholder="اسم المطعم"
                required
              />
            </div>
            <div className="flex gap-4 mt-5 ms-auto">
              <Button
                isProcessing={loadingAdd}
                role="button"
                type="submit"
                disabled={!formik.isValid || loadingAdd}
              >
                اضافة
              </Button>
              <Button
                className="bg-red-700 hover:!bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                onClick={() => closeModal()}
              >
                الغاء
              </Button>
            </div>
          </form>
        </Modal>,
        document.getElementById("portal")
      )}
    </motion.div>
  );
};

export default Restaurants;
