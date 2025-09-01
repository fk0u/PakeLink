import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.light,
  backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main} 10%, ${theme.palette.primary.light} 90%)`,
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  maxWidth: 500,
  width: '100%',
  borderRadius: 12,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
}));

function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthBackground>
      <Container maxWidth="sm">
        <AuthPaper>
          <Logo variant="h4">PakeLink</Logo>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Catat PKL Lo, Biar Nggak Lupa Rasanya! 🤪
          </Typography>
          <Box width="100%" mt={2}>
            <Outlet />
          </Box>
        </AuthPaper>
      </Container>
    </AuthBackground>
  );
}

export default AuthLayout;
