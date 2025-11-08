import toast from "react-hot-toast";

export const toastSuccess = (message) => {
    toast.success(message, { duration: 2500 });
};

export const toastError = (message) => {
    toast.error(message, { duration: 3000 });
};

export const toastInfo = (message) => {
    toast(message, { duration: 2500 });
};
