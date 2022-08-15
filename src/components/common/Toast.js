import { toast } from 'react-toastify';

export const setToast = (type, message) => {
    const options = {
        type: type,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    }

    return toast(message, options);
}