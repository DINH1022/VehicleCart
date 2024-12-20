
import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

const showToast = (title, type) => {
  switch (type) {
    case 'success':
      toast.success(title, toastConfig);
      break;
    case 'error':
      toast.error(title, toastConfig);
      break;
    default:
      toast.info(title, toastConfig);
  }
};

export default showToast