import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  Book as BookIcon,
  EventNote as EventNoteIcon,
  Chat as ChatIcon,
  Rule as RuleIcon,
} from '@mui/icons-material';

const DashboardCard = ({ title, icon, description, buttonText, link, color }) => {
  const navigate = useNavigate();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: color,
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => navigate(link)}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  // Define cards based on user role
  const getCards = () => {
    const commonCards = [
      {
        title: 'Peraturan PKL',
        icon: <RuleIcon />,
        description: 'Lihat peraturan dan tata tertib yang berlaku selama PKL.',
        buttonText: 'Lihat Peraturan',
        link: '/regulations',
        color: '#9c27b0',
      },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Siswa PKL',
            icon: <SchoolIcon />,
            description: 'Kelola data siswa yang sedang menjalani PKL.',
            buttonText: 'Kelola Siswa',
            link: '/students',
            color: '#2196f3',
          },
          {
            title: 'Tempat PKL',
            icon: <BusinessIcon />,
            description: 'Kelola data perusahaan atau instansi tempat PKL.',
            buttonText: 'Kelola Tempat PKL',
            link: '/companies',
            color: '#ff9800',
          },
          {
            title: 'Jurnal Kegiatan',
            icon: <BookIcon />,
            description: 'Akses dan tinjau jurnal kegiatan harian siswa PKL.',
            buttonText: 'Lihat Jurnal',
            link: '/journals',
            color: '#4caf50',
          },
          {
            title: 'Absensi',
            icon: <EventNoteIcon />,
            description: 'Lihat dan kelola absensi siswa PKL.',
            buttonText: 'Lihat Absensi',
            link: '/attendance',
            color: '#f44336',
          },
          {
            title: 'Konsultasi',
            icon: <ChatIcon />,
            description: 'Lihat agenda konsultasi dan permasalahan siswa PKL.',
            buttonText: 'Lihat Konsultasi',
            link: '/consultations',
            color: '#00bcd4',
          },
          ...commonCards,
        ];
      case 'student':
        return [
          {
            title: 'Jurnal Kegiatan',
            icon: <BookIcon />,
            description: 'Catat kegiatan harian kamu selama PKL.',
            buttonText: 'Isi Jurnal',
            link: '/journals',
            color: '#4caf50',
          },
          {
            title: 'Absensi',
            icon: <EventNoteIcon />,
            description: 'Lihat rekap absensi kamu selama PKL.',
            buttonText: 'Lihat Absensi',
            link: '/attendance',
            color: '#f44336',
          },
          {
            title: 'Konsultasi',
            icon: <ChatIcon />,
            description: 'Ajukan konsultasi atau sampaikan permasalahan ke pembimbing.',
            buttonText: 'Buat Konsultasi',
            link: '/consultations',
            color: '#00bcd4',
          },
          ...commonCards,
        ];
      case 'company_supervisor':
        return [
          {
            title: 'Siswa PKL',
            icon: <SchoolIcon />,
            description: 'Lihat siswa yang PKL di tempat Anda.',
            buttonText: 'Lihat Siswa',
            link: '/students',
            color: '#2196f3',
          },
          {
            title: 'Jurnal Kegiatan',
            icon: <BookIcon />,
            description: 'Beri paraf dan evaluasi jurnal kegiatan siswa.',
            buttonText: 'Tinjau Jurnal',
            link: '/journals',
            color: '#4caf50',
          },
          {
            title: 'Absensi',
            icon: <EventNoteIcon />,
            description: 'Isi dan tanda tangani absensi siswa PKL.',
            buttonText: 'Isi Absensi',
            link: '/attendance',
            color: '#f44336',
          },
          {
            title: 'Konsultasi',
            icon: <ChatIcon />,
            description: 'Tanggapi konsultasi dari siswa PKL.',
            buttonText: 'Lihat Konsultasi',
            link: '/consultations',
            color: '#00bcd4',
          },
          ...commonCards,
        ];
      case 'school_supervisor':
        return [
          {
            title: 'Siswa PKL',
            icon: <SchoolIcon />,
            description: 'Kelola siswa yang menjadi bimbingan Anda.',
            buttonText: 'Kelola Siswa',
            link: '/students',
            color: '#2196f3',
          },
          {
            title: 'Tempat PKL',
            icon: <BusinessIcon />,
            description: 'Lihat data tempat PKL siswa bimbingan Anda.',
            buttonText: 'Lihat Tempat PKL',
            link: '/companies',
            color: '#ff9800',
          },
          {
            title: 'Jurnal Kegiatan',
            icon: <BookIcon />,
            description: 'Tinjau jurnal kegiatan siswa bimbingan Anda.',
            buttonText: 'Tinjau Jurnal',
            link: '/journals',
            color: '#4caf50',
          },
          {
            title: 'Absensi',
            icon: <EventNoteIcon />,
            description: 'Verifikasi absensi siswa bimbingan Anda.',
            buttonText: 'Verifikasi Absensi',
            link: '/attendance',
            color: '#f44336',
          },
          {
            title: 'Konsultasi',
            icon: <ChatIcon />,
            description: 'Tanggapi konsultasi dari siswa bimbingan Anda.',
            buttonText: 'Lihat Konsultasi',
            link: '/consultations',
            color: '#00bcd4',
          },
          ...commonCards,
        ];
      default:
        return commonCards;
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Halo, {user?.firstName} {user?.lastName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selamat datang di PakeLink, aplikasi manajemen PKL SMKN 7 Samarinda
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {getCards().map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          PakeLink: Catat PKL Lo, Biar Nggak Lupa Rasanya! 🤪
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          PakeLink adalah aplikasi pengelolaan administrasi dan pelaporan Praktik Kerja Lapangan (PKL) 
          untuk siswa SMKN 7 Samarinda. Aplikasi ini dirancang untuk memudahkan proses administrasi 
          dan dokumentasi selama masa PKL.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
