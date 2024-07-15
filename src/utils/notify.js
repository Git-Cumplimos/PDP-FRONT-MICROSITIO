import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const notify = (msg = "Info", otherOptions = {}) => {
  toast.info(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...otherOptions,
  });
};

const notifyError = (msg = "Error", autoClose = 5000, otherOptions = {}) => {
  toast.warning(msg, {
    position: "top-center",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...otherOptions,
    autoClose: autoClose,
  });
};

export { notify, notifyError };