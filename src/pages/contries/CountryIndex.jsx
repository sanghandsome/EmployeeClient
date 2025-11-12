import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, TablePagination, TextField,
  IconButton, CircularProgress, Button, InputAdornment,
  Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CountryForm from "../contries/CountryForm";
import Modal from "../../components/modal/Modal";
import CountryStore from "../../stores/CountryStore";
import "./CountryIndex.css";
import Notification from "../../components/Notification";
const CountryIndex = observer(() => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCountry, setEditCountry] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    CountryStore.fetchCountries();
  }, []);

  const handleOpenEdit = (country) => {
    setEditCountry(country);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditCountry(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editCountry) {
        setSnackbar({ open: true, message: "Cập nhật thành công", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Thêm mới thành công", severity: "success" });
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Thao tác thất bại", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
  const result = await CountryStore.deleteCountry(id);
    if (result) {
      setSnackbar({
        open: true,
        message: "Xóa thành công",
        severity: "success",
      });
    } else {
    }
  };

  return (
    <div className="country-page">
      <h2>Quản lý quốc gia</h2>

      <div className="country-toolbar">
        <TextField
          placeholder="Tìm kiếm..."
          value={CountryStore.keyword}
          onChange={(e) => CountryStore.setKeyword(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="search-field"
        />

        <Button
          variant="contained"
          onClick={handleAddNew}
          className="add-btn"
        >
          Thêm mới
        </Button>
      </div>

      <Paper className="country-table-wrapper">
        <TableContainer>
          <Table className="country-table">
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Mã</TableCell>
                <TableCell>Tên quốc gia</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {CountryStore.loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : CountryStore.countryList.length > 0 ? (
                CountryStore.countryList.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell className="cell-text">{c.code}</TableCell>
                    <TableCell className="cell-text">{c.name}</TableCell>
                    <TableCell className="cell-text">{c.description}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenEdit(c)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(c.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={CountryStore.totalCount}
          page={CountryStore.pageIndex}
          onPageChange={(e, newPage) => CountryStore.setPageIndex(newPage)}
          rowsPerPage={CountryStore.pageSize}
          onRowsPerPageChange={(e) => CountryStore.setPageSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>

      {/* FORM MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCountry ? "Sửa quốc gia" : "Thêm quốc gia"}
      >
        <CountryForm
          country={editCountry}
          onSave={handleSave} // gọi store trực tiếp
        />
      </Modal>

      {/* Snackbar thông báo */}
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        duration={4000} // 4s
        position={{ vertical: "top", horizontal: "right" }}
        width={500}
        height={60}
      />
    </div>
  );
});

export default CountryIndex;