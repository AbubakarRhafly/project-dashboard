import toast from "react-hot-toast";

export const toastSuccess = (msg) => toast.success(msg, { duration: 10000 });
export const toastError = (msg) => toast.error(msg, { duration: 12000 });
export const toastInfo = (msg) => toast(msg, { duration: 10000 });
