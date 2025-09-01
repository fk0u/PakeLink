import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, resetAuthState } from '../../features/auth/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Role is required'),
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }

    // Reset auth state on component unmount
    return () => {
      dispatch(resetAuthState());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (values) => {
    const { confirmPassword, ...registerData } = values;
    dispatch(register(registerData));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Buat akun baru untuk mengakses PakeLink
      </Typography>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student',
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, handleChange }) => (
          <Form>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Field
                as={TextField}
                name="firstName"
                label="Nama Depan"
                fullWidth
                margin="normal"
                variant="outlined"
                error={errors.firstName && touched.firstName}
                helperText={<ErrorMessage name="firstName" />}
                disabled={loading}
              />

              <Field
                as={TextField}
                name="lastName"
                label="Nama Belakang"
                fullWidth
                margin="normal"
                variant="outlined"
                error={errors.lastName && touched.lastName}
                helperText={<ErrorMessage name="lastName" />}
                disabled={loading}
              />
            </Box>

            <Field
              as={TextField}
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              variant="outlined"
              error={errors.username && touched.username}
              helperText={<ErrorMessage name="username" />}
              disabled={loading}
            />

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

            <FormControl fullWidth margin="normal" variant="outlined" error={errors.role && touched.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={values.role}
                onChange={handleChange}
                label="Role"
                disabled={loading}
              >
                <MenuItem value="student">Siswa</MenuItem>
                <MenuItem value="company_supervisor">Pembimbing DU/DI</MenuItem>
                <MenuItem value="school_supervisor">Pembimbing Sekolah</MenuItem>
              </Select>
              <ErrorMessage name="role" component={Typography} variant="caption" color="error" />
            </FormControl>

            <Field
              as={TextField}
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              error={errors.password && touched.password}
              helperText={<ErrorMessage name="password" />}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Field
              as={TextField}
              name="confirmPassword"
              label="Konfirmasi Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              error={errors.confirmPassword && touched.confirmPassword}
              helperText={<ErrorMessage name="confirmPassword" />}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            Sudah punya akun? Login
          </Typography>
        </Link>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="textSecondary" align="center">
        Dengan mendaftar, Anda menyetujui syarat dan ketentuan PakeLink.
      </Typography>
    </Box>
  );
}

export default Register;
