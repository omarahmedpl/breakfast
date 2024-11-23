import { Button, Spinner, Table } from "flowbite-react";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReturnWithTitle from "../../components/ReturnWithTitle";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
const AllOrders = () => {
  const navigate = useNavigate();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [orders, setOrders] = useState([]);
  const formik = useFormik({
    initialValues: {
      order_name: "",
      rest_name: "",
    },
    validateOnMount: true,
    onReset: () => {
      formik.setValues({ order_name: "", rest_name: "" });
    },
    validationSchema: yup.object({
      order_name: yup.string().required("اسم المطعم مطلوب"),
      rest_name: yup.string().required("اسم المطعم مطلوب"),
    }),
  });
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fetchAllRestaurants = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}restaurants`);
    const data = await response.json();
    setRestaurants(data);
    console.log(data.restaurants);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const getAllOrders = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}orders`);
    const data = await response.json();
    console.log(data);
    setOrders(data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (rowData) => {
    setEditData(rowData); // Set data for editing
    formik.setValues({
      order_name: rowData.order_name,
      rest_name: rowData.rest_id,
    });
    setIsEditModalOpen(true); // Open the modal
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    if (editData.order_name.trim() === "") {
      toast.error("اسم الطلب مطلوب");
      return;
    } else {
      setLoadingAdd(true);
      try {
        const data = await axios.put(
          `${import.meta.env.VITE_BASE_URL}orders/${editData.order_id}`,
          {
            order_name: formik.values.order_name,
            order_rest: formik.values.rest_name,
          }
        );
        console.log("API response:", data); // Debug log
        setTimeout(() => {
          setLoadingAdd(false);
          setIsEditModalOpen(false);
          toast.success("تم تعديل الطلب بنجاح");
          getAllOrders();
        }, 1000);
      } catch (error) {
        console.error("API error:", error); // Debug log
        setTimeout(() => {
          setLoadingAdd(false);
          toast.error("حدث خطأ ما");
        }, 1000);
      }
    }
  };

  const deleteOrder = async (rest_id) => {
    try {
      const data = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}orders/${rest_id}`
      );
      console.log(data);
      getAllOrders(); // Refetch
      toast.success("تم حذف الطلب بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  };

  useEffect(() => {
    getAllOrders();
    fetchAllRestaurants();
  }, []);
  return (
    <>
      {!loading ? (
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
          className="overflow-x-auto w-full px-10"
        >
          <ToastContainer
            position="bottom-center"
            hideProgressBar={true}
            draggable={true}
          />
          <ReturnWithTitle title="جميع الطلبات" />
          <div>
            <DataTable
              value={orders.orders || []}
              paginator
              rows={5}
              tableStyle={{ minWidth: "50rem", marginTop: "20px" }}
              stripedRows
              removableSort
            >
              <Column
                align="left"
                className="w-[70px] text-start"
                sortable
                field="order_id"
                header="#"
              ></Column>
              <Column
                align="left"
                sortable
                field="order_name"
                className="w-[130px] text-start"
                header="الإسم"
              ></Column>

              <Column
                align="left"
                sortable
                field="rest_name"
                className="w-[130px] text-start"
                header="اسم المطعم"
              ></Column>
              <Column
                header="Actions"
                body={(rowData) => (
                  <div className="flex gap-2 justify-start w-[300px]">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => {
                        navigate(`/orders/details/${rowData.order_id}`);
                      }}
                    >
                      تفاصيل الطلب
                    </Button>
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => handleEdit(rowData)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => deleteOrder(rowData.order_id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
                headerStyle={{ width: "10%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              />
            </DataTable>
          </div>

          {/* Edit Modal */}
          <Dialog
            header="تعديل الطلب"
            visible={isEditModalOpen}
            className="md:w-[40vw] w-full"
            onHide={() => setIsEditModalOpen(false)}
            closable={true}
            transitionOptions={{ speed: 1000 }}
          >
            {editData && (
              <form onSubmit={saveEdit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="order_name" className="block mb-1 font-bold">
                    أدخل اسم الطلب
                  </label>
                  <InputText
                    id="order_name"
                    placeholder="اسم الطلب"
                    name="order_name"
                    value={formik.values.order_name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="rest_name" className="block mb-1 font-bold">
                    أدخل اسم المطعم
                  </label>
                  <Dropdown
                    id="rest_name"
                    name="rest_name"
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
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    isProcessing={loadingAdd}
                    disabled={loadingAdd || !formik.isValid}
                    onClick={saveEdit}
                    color="info"
                  >
                    حفظ
                  </Button>
                  <Button
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-red-700 hover:!bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            )}
          </Dialog>
        </motion.div>
      ) : (
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
      )}
    </>
  );
};

export default AllOrders;
