import { useEffect, useState } from "react";
import ReturnWithTitle from "../../components/ReturnWithTitle";
import InfoItem from "../../components/InfoItem";
import { Button, Clipboard, Spinner } from "flowbite-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { motion } from "motion/react";
import ClipboardWrapper from "../../components/ClipboardWrapper";
const OrderInfo = () => {
  const [orderInfo, setOrderInfo] = useState("");
  const [mode, setMode] = useState(""); // "edit" or "add"
  const [editingItem, setEditingItem] = useState(null); // Currently selected item
  const [editedValues, setEditedValues] = useState({
    item_name: "",
    item_count: "",
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setEditingItem(null);
  };
  const handleClose = () => setOpen(false);
  const location = useLocation();
  const orderID = location.pathname.split("/")[3];
  console.log(orderID);
  const { isPending, error, data } = useQuery({
    queryKey: ["orderInfo"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}orders/${orderID}`).then((res) =>
        res.json()
      ),
  });

  useEffect(() => {
    if (data) {
      const myOrderInfo = data.order.map((item) => {
        return `${item.item_name} : ${item.item_count}`;
      });
      setOrderInfo(myOrderInfo.join("\n"));
    }
  }, [data]);
  const queryClient = useQueryClient();

  const {
    data: items,
    isPending: itemsPending,
    error: itemsError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}items`).then((res) => res.json()),
  });
  const deleteItem = async (item_id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}orders/${orderID}/${item_id}`
      );
      toast.success("تم حذف الوجبة بنجاح");
      queryClient.invalidateQueries(["orderInfo"]);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("حدث خطأ ما");
    }
  };
  const startAdding = () => {
    setMode("add");
    setEditingItem({}); // Set an empty object or null for clarity
    setEditedValues({
      item_name: "",
      item_count: "",
      item_id: "", // Ensure this is empty for new items
    });
  };

  const startEditing = (item) => {
    setMode("edit");
    setEditingItem(item); // This holds the original item for reference
    setEditedValues({
      item_name: item.item_name,
      item_count: item.item_count,
      item_id: item.item_id,
    });
  };
  const handleInputChange = (field, value) => {
    console.log(field, value);
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        // Editing existing item
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}orders/${orderID}/update_item`,
          editedValues
        );
        toast.success("تم تحديث البيانات بنجاح");
      } else if (mode === "add") {
        console.log(editedValues);

        if (!editedValues.item_count.trim() || !editedValues.item_name) {
          toast.error("الرجاء ملأ جميع الفراغات");
          return;
        }
        // Adding a new item
        console.log(editedValues);

        await axios.post(
          `${import.meta.env.VITE_BASE_URL}orders/${orderID}/add_item`,
          {
            item_id: editedValues.item_name,
            item_count: editedValues.item_count,
          }
        );
        toast.success("تم إضافة العنصر بنجاح");
      }
      queryClient.invalidateQueries(["orderInfo"]);
      setMode(""); // Reset mode
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("حدث خطأ ما");
    }
  };
  if (isPending)
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
        className="loading flex flex-col gap-5 justify-center items-center h-full w-full px-10 xl:px-32"
      >
        <Spinner size="xl" />
        <ToastContainer
          position="bottom-center"
          hideProgressBar={true}
          draggable={true}
        />
        <div className="text-2xl font-bold">جاري التحميل...</div>
      </motion.div>
    );

  if (error)
    return (
      <div className="loading flex flex-col gap-5 justify-center items-center h-full w-full px-10 xl:px-32">
        <div className="text-2xl font-bold text-white">
          !حدث خطأ ما الرجاء المحاولة مرة اخرى
        </div>
      </div>
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
      className="flex flex-col gap-10 sm:justify-center sm:items-center w-full px-10 xl:px-32 h-full"
    >
      <ReturnWithTitle title="معلومات الطلب" />
      <div className="grid lg:grid-cols-4 grid-cols-1 mt-8 sm:mt-0 gap-5 items-center justify-center w-full">
        <InfoItem title={"رقم الطلب"} text={data.order[0].order_id} />
        <InfoItem title="اسم الطلب" text={data.order[0].order_name} />
        <InfoItem
          title="تاريخ الطلب"
          text={`${new Date(data.order[0].order_date).getDate()}/${
            new Date(data.order[0].order_date).getMonth() + 1
          }/${new Date(data.order[0].order_date).getFullYear()}`}
        />
        <InfoItem title="اسم المطعم" text={data.order[0].rest_name} />
      </div>
      <div className="flex sm:justify-end justify-between gap-[5px]  w-full mb-10 sm:gap-4">
        {
          <>
            <Button onClick={handleOpen} size="lg" color="info">
              عرض تفاصيل الطلب
            </Button>
            {!isPending &&
              orderInfo &&
              (console.log(orderInfo),
              (
                <ClipboardWrapper
                  valueToCopy={orderInfo}
                  className="h-full"
                  label="نسخ تفاصيل الطلب"
                />
              ))}
          </>
        }
      </div>
      <Dialog
        header="معلومات الطلب"
        visible={open}
        className="md:w-[40vw] w-full"
        onHide={handleClose}
        closable={true}
        transitionOptions={{ speed: 1000 }}
      >
        <div className="flex flex-col gap-4">
          <div>
            {data.order[0].item_name !== null ? (
              <DataTable
                value={data.order || []}
                paginator
                rows={5}
                tableStyle={{ minWidth: "100%", marginTop: "20px" }}
                stripedRows
                removableSort
              >
                <Column
                  align="left"
                  sortable
                  className="w-[70px] text-start"
                  field="item_name"
                  header="اسم الوجبة"
                ></Column>
                <Column
                  align="left"
                  sortable
                  field="item_count"
                  className="w-[130px] text-start"
                  header="الكمية"
                ></Column>
                <Column
                  className="w-[300px]"
                  header="Actions"
                  body={(rowData) => (
                    <div className="flex gap-2 justify-start w-[300px]">
                      <Button
                        color="info"
                        size="sm"
                        onClick={() => {
                          setMode("edit");
                          startEditing(rowData);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button color="failure" size="sm">
                        <Trash2
                          onClick={() => deleteItem(rowData.item_id)}
                          size={16}
                        />
                      </Button>
                    </div>
                  )}
                  headerStyle={{ width: "10%", minWidth: "8rem" }}
                  bodyStyle={{ textAlign: "center" }}
                />
              </DataTable>
            ) : (
              <div className="text-2xl font-bold text-center">
                لا يوجد وجبات
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleClose} color="failure">
              إغلاق
            </Button>
            <Button
              color="info"
              size="sm"
              onClick={() => {
                setOpen(true);
                startAdding();
              }}
            >
              إضافة وجبة
            </Button>
          </div>
        </div>
        {editingItem && (
          <div className="mt-4">
            <h3>
              {mode === "edit" ? "تعديل بيانات الوجبة" : "إضافة وجبة جديدة"}
            </h3>
            <form onSubmit={saveChanges} className="flex gap-4">
              <Dropdown
                disabled={mode === "edit"} // Disable in edit mode
                value={editedValues.item_name}
                onChange={(e) => handleInputChange("item_name", e.value)}
                options={items.items?.map((item) => ({
                  label: item.item_name,
                  value: item.item_id,
                }))}
                loading={itemsPending}
                placeholder={
                  mode === "edit" ? editingItem.item_name : "اختر الوجبة"
                }
                className="w-full md:w-14rem"
              />
              <input
                type="number"
                value={editedValues.item_count}
                onChange={(e) =>
                  handleInputChange("item_count", e.target.value)
                }
                placeholder="الكمية"
                className="p-2 border rounded"
              />
              <Button type="submit" onClick={saveChanges} color="success">
                {mode === "edit" ? "حفظ التعديلات" : "إضافة"}
              </Button>
            </form>
          </div>
        )}
      </Dialog>
    </motion.div>
  );
};

export default OrderInfo;
