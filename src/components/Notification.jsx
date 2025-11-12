// src/components/Notification.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * Notification component đơn giản
 * Props:
 * - open: boolean (hiển thị hay không)
 * - message: string (nội dung thông báo)
 * - severity: "success" | "error" | "warning" | "info"
 * - onClose: function (callback khi đóng)
 * - duration: number (ms, thời gian hiển thị, default 3000)
 * - position: { vertical: "top" | "bottom", horizontal: "left" | "center" | "right" }
 */
export default function Notification({
  open,
  message,
  severity = "success",
  onClose,
  duration = 3000,
  position = { vertical: "top", horizontal: "center" },
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}