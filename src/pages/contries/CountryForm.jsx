import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box } from "@mui/material";
import CountryStore from "../../stores/CountryStore";

const validationSchema = Yup.object({
  code: Yup.string().required("Vui lòng nhập mã quốc gia"),
  name: Yup.string().required("Vui lòng nhập tên quốc gia"),
  description: Yup.string().required("Vui lòng nhập mô tả"),
});

export default function CountryForm({ country, onSave }) {
  const initialValues = country || { code: "", name: "", description: "" };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (country) {
        // update country thông qua MobX store
        await CountryStore.updateCountry(country.id, values);
      } else {
        // create country thông qua MobX store
        await CountryStore.createCountry(values);
      }

      if (onSave) onSave(); // callback để đóng modal
    } catch (e) {
      console.error("Form submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 5, backgroundColor: "#fff" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize // quan trọng khi edit country
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, isSubmitting }) => (
          <Form>
            {/* Mã quốc gia */}
            <Box mb={2}>
              <TextField
                fullWidth
                name="code"
                label="Mã quốc gia"
                value={values.code}
                onChange={handleChange}
                variant="outlined"
                sx={{ backgroundColor: "white" }}
              />
              <ErrorMessage
                name="code"
                component="div"
                style={{ color: "red", fontSize: 13, marginTop: 4 }}
              />
            </Box>

            {/* Tên quốc gia */}
            <Box mb={2}>
              <TextField
                fullWidth
                name="name"
                label="Tên quốc gia"
                value={values.name}
                onChange={handleChange}
                variant="outlined"
                sx={{ backgroundColor: "white" }}
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: "red", fontSize: 13, marginTop: 4 }}
              />
            </Box>

            {/* Mô tả */}
            <Box mb={2}>
              <TextField
                fullWidth
                name="description"
                label="Mô tả"
                value={values.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                sx={{ backgroundColor: "white" }}
              />
              <ErrorMessage
                name="description"
                component="div"
                style={{ color: "red", fontSize: 13, marginTop: 4 }}
              />
            </Box>

            {/* Nút submit */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 2, py: 1 }}
            >
              {country ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}