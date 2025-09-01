import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../features/auth/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (values) => {
    dispatch(forgotPassword(values.email))
      .unwrap()
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        // Error is handled by the toast in the slice
      });
  };

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Lupa Password
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Masukkan email Anda untuk mendapatkan link reset password
      </Typography>

      {submitted ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Kami telah mengirimkan instruksi reset password ke email Anda. Silakan periksa kotak masuk Anda.
        </Alert>
      ) : (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={errors.email && touched.email}
                helperText={<ErrorMessage name="email" />}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Form>
          )}
        </Formik>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            Kembali ke halaman login
          </Typography>
        </Link>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="textSecondary" align="center">
        Jika Anda tidak menerima email setelah beberapa saat, pastikan untuk memeriksa folder spam atau hubungi administrator.
      </Typography>
    </Box>
  );
}

export default ForgotPassword;
