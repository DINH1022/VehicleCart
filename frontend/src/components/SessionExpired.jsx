import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SessionExpiredModal = ({ isOpen, onClose, onLogin }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Phiên đăng nhập đã hết hạn
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLogin}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Đăng nhập lại
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionExpiredModal;
