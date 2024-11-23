import React from "react";
import { Clipboard, Toast } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";

const ClipboardWrapper = ({ valueToCopy, label, className }) => {
  console.log(valueToCopy)
  const handleCopy = async () => {
    if (!valueToCopy) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(valueToCopy);
        toast.success("تم النسخ بنجاح");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = valueToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("تم النسخ بنجاح");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("حدث خطأ ما");
    }
  };

  return (
    <>
      <Clipboard
        valueToCopy={valueToCopy}
        className={className}
        label={label}
        onClick={handleCopy}
      />
      <ToastContainer
               className="px-5 sm:px-0"

        position="bottom-center"
        hideProgressBar={true}
        draggable={true}
      />
    </>
  );
};

export default ClipboardWrapper;
