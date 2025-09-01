import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 100, color: 'primary.main', mb: 2 }}
        />
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Maaf, halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          Kembali ke Beranda
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
