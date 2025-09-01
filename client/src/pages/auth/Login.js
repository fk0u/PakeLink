import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login, resetAuthState } from '../../features/auth/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Check if there's a redirect path
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    // Reset auth state on component unmount
    return () => {
      dispatch(resetAuthState());
    };
  }, [isAuthenticated, navigate, dispatch, from]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Masuk ke akun Anda untuk mengakses PakeLink
      </Typography>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="username"
              label="Username atau Email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={errors.username && touched.username}
              helperText={<ErrorMessage name="username" />}
              disabled={loading}
            />

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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            Lupa Password?
          </Typography>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            Belum punya akun? Daftar
          </Typography>
        </Link>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="textSecondary" align="center">
        Hubungi Administrator jika Anda mengalami kesulitan login.
      </Typography>
    </Box>
  );
}

export default Login;
