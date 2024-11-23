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
import ReturnWithTitle from "../../components/ReturnWithTitle";
import { Dropdown } from "primereact/dropdown";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
const Orders = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantIDs, setRestaurantIDs] = useState([]);
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const formik = useFormik({
    initialValues: {
      rest_name: "",
      order_name: "",
    },
    validateOnMount: true,
    onReset: () => {
      formik.setValues({ rest_name: "", order_name: "" });
    },
    validationSchema: yup.object({
      rest_name: yup.string().required("اسم المطعم مطلوب"),
      order_name: yup.string().required("اسم الطلب مطلوب"),
    }),
    onSubmit: async (values) => {
      setLoadingAdd(true);
      const data = await axios.post(`${import.meta.env.VITE_BASE_URL}orders`, {
        ...values,
        order_rest: values.rest_name,
      });
      if (data.status === 200 || data.status === 201) {
        toast.success("تم اضافة الطلب بنجاح");
        // console.log(data.data);

        setTimeout(() => {
          setLoadingAdd(false);
          closeModal();
          navigate(`/orders/details/${data.data.order_id}`);
        }, 2000);
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

  const fetchAllRestaurants = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}restaurants`);
    const data = await response.json();
    setRestaurants(data);
    console.log(data.restaurants);
    const names = data.restaurants.map((restaurant) => {
      return restaurant.rest_name;
    });
    const ids = data.restaurants.map((restaurant) => {
      return restaurant.rest_id;
    });
    setRestaurantNames(names);
    setRestaurantIDs(ids);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  useEffect(() => {
    fetchAllRestaurants();
  }, []);
  useEffect(() => {
    console.log(formik.values, formik.errors, formik.isValid);
  }, [formik.values, formik.errors, formik.isValid]);
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
      className="flex flex-col md:gap-16 gap-8 mt-[-50px] h-full w-full px-10 xl:px-32 "
    >
      <ToastContainer
               className="px-5 sm:px-0"

        position="bottom-center"
        hideProgressBar={true}
        draggable={true}
      />
      <ReturnWithTitle title="الطلبات" />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5  w-full ">
        <PageItem left={true} text="عرض الطلبات السابقة" to="/orders/all" />
        <PageItem left={false} text="اضافة طلب جديد" onClick={openModal} />
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
              <Dropdown
                value={formik.values.rest_name}
                onChange={(e) => formik.setFieldValue("rest_name", e.value)}
                options={restaurants.restaurants?.map((restaurant) => ({
                  label: restaurant.rest_name, // Displayed to the user
                  value: restaurant.rest_id, // Internal value
                }))}
                placeholder={`${loading ? "Loading..." : "اختر المطعم"}`}
                loading={loading}
                className="w-full md:w-14rem"
              />

              <div className="mb-2 block mt-5">
                <Label
                  className="text-black font-bold"
                  htmlFor="rest_name"
                  value="اسم الطلب"
                />
              </div>
              <TextInput
                id="order_name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.order_name}
                name="order_name"
                onBlur={formik.handleBlur}
                placeholder="اسم الطلب"
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

export default Orders;
