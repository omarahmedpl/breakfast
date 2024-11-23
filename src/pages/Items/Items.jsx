import { useState } from "react";
import ReactDOM from "react-dom";
import PageItem from "../../components/PageItem";
import ReturnWithTitle from "../../components/ReturnWithTitle";
import { motion } from "motion/react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../../components/Modal";
import { Button, Label } from "flowbite-react";
const Items = () => {
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    formik.resetForm({ values: { item_name: "" } });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      item_name: "",
    },
    validateOnMount: true,
    onReset: () => {
      formik.setValues({
        item_name: "",
      });
    },
    validationSchema: yup.object({
      item_name: yup.string().required("اسم الوجبة مطلوب"),
    }),
  });
  const addNewItem = async () => {
    if (formik.values.item_name.trim() === "") {
      toast.error("اسم الوجبة مطلوب");
      return;
    }
    setLoadingAdd(true);
    const data = await axios.post(`${import.meta.env.VITE_BASE_URL}items`, {
      item_name: formik.values.item_name,
    });
    if (data.status === 200 || data.status === 201) {
      console.log(data.data);
      formik.resetForm({ values: { item_name: "" } });
      toast.success("تم اضافة الوجبة بنجاح");
      setLoadingAdd(false);
      setOpen(false);
    } else {
      toast.error("حدث خطأ ما");
      setLoadingAdd(false);
    }
  };
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
      <ReturnWithTitle title="الوجبات" />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5  w-full ">
        <PageItem left={true} text="عرض جميع الوجبات" to="/items/all" />
        <PageItem
          left={false}
          text="اضافة وجبة جديد"
          to="No"
          onClick={handleOpen}
        />
      </div>
      {ReactDOM.createPortal(
        <Modal isOpen={open} setIsOpen={setOpen} title="إضافة وجبة جديدة">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewItem();
            }}
            className="flex w-full flex-col my-4 text-black p-5 gap-5"
          >
            <Label
              className="text-black font-bold"
              htmlFor="item_name"
              value="اسم الوجبة"
            />
            <input
              name="item_name"
              id="item_name"
              type="text"
              className="rounded-lg border border-gray-300 p-2"
              placeholder="اسم الوجبة"
              {...formik.getFieldProps("item_name")}
            />

            <div className="flex gap-4 ms-auto">
              <Button
                isProcessing={loadingAdd}
                type="submit"
                disabled={!formik.isValid || loadingAdd}
              >
                {loadingAdd ? "جاري الاضافة..." : "اضافة"}
              </Button>
              <Button
                className="bg-red-700 hover:!bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                onClick={() => handleClose()}
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

export default Items;
