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
import { motion } from "motion/react";
const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAllItems = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}items`);
    const data = await response.json();
    setItems(data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (rowData) => {
    setEditData(rowData); // Set data for editing
    setIsEditModalOpen(true); // Open the modal
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (editData.item_name.trim() === "") {
      toast.error("اسم الوجبة مطلوب");
      return;
    } else {
      try {
        const data = await axios.put(
          `${import.meta.env.VITE_BASE_URL}items/${editData.item_id}`,
          { item_name: editData.item_name }
        );
        console.log("API response:", data); // Debug log
        toast.success("تم تعديل الوجبة بنجاح");
        setIsEditModalOpen(false);
        fetchAllItems();
      } catch (error) {
        console.error("API error:", error); // Debug log
        toast.error("حدث خطأ ما");
      }
    }
  };

  const deleteItem = async (item_id) => {
    try {
      const data = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}items/${item_id}`
      );
      console.log(data);
      fetchAllItems(); // Refetch
      toast.success("تم حذف الوجبة بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  };

  useEffect(() => {
    fetchAllItems();
    console.log(import.meta.env.VITE_SOME_KEY);
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
          <ReturnWithTitle title="جميع الوجبات" />
          <div>
            <DataTable
              value={items.items || []}
              paginator
              rows={5}
              tableStyle={{ minWidth: "50rem", marginTop: "20px" }}
              stripedRows
              removableSort
            >
              <Column
                align="left"
                sortable
                className="w-[70px] text-start"
                field="item_id"
                header="#"
              ></Column>
              <Column
                align="left"
                sortable
                field="item_name"
                className="w-[130px] text-start"
                header="الإسم"
              ></Column>
              <Column
                className="w-[300px]"
                header="Actions"
                body={(rowData) => (
                  <div className="flex gap-2 justify-start w-[300px]">
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
                      onClick={() => deleteItem(rowData.item_id)}
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
            header="تعديل الوجبة"
            visible={isEditModalOpen}
            className="md:w-[40vw] w-full"
            onHide={() => setIsEditModalOpen(false)}
            closable={true}
            transitionOptions={{ speed: 1000 }}
          >
            {editData && (
              <form onSubmit={saveEdit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="item_name" className="block mb-1 font-bold">
                    أدخل اسم الوجبة
                  </label>
                  <InputText
                    id="item_name"
                    placeholder="اسم الوجبة"
                    value={editData.item_name}
                    onChange={(e) =>
                      setEditData({ ...editData, item_name: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" onClick={saveEdit} color="info">
                    حفظ
                  </Button>
                  <Button
                    onClick={() => setIsEditModalOpen(false)}
                    color="failure"
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

export default AllItems;
