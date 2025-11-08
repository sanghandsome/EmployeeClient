import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, TablePagination, TextField,
  IconButton, CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import { InputAdornment } from "@mui/material";
import {
  pagingCountries,
  deleteCountry
} from "../../services/ContryService";
import CountryForm from "../contries/CountryForm";
import Modal from "../../components/modal/Modal";
import "./CountryIndex.css";

export default function CountryIndex() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCountry, setEditCountry] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await pagingCountries(pageIndex, pageSize, keyword);
      const data = res?.data || [];
      const totalCount = res?.totalCount || 0;
      setCountries(data);
      setTotalCount(totalCount);
    } catch (e) {
      console.error("Load data error:", e);
      setCountries([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [pageIndex, pageSize, keyword]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      await deleteCountry(id);
      loadData();
    }
  };

  const handleOpenEdit = (country) => {
    setEditCountry(country);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditCountry(null);
    setModalOpen(true);
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="country-page">
      <h2>Quản lý quốc gia</h2>

      <div className="country-toolbar">
        <TextField
          placeholder="Tìm kiếm..."
          value={keyword}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon className="search-icon" />,
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : countries.length > 0 ? (
                countries.map((c) => (
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
          count={totalCount}
          page={pageIndex}
          onPageChange={(e, newPage) => setPageIndex(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPageIndex(0);
          }}
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
          onSuccess={() => {
            setModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}