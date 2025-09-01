import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import studentReducer from './students/studentSlice';
import companyReducer from './companies/companySlice';
import journalReducer from './journals/journalSlice';
import attendanceReducer from './attendance/attendanceSlice';
import consultationReducer from './consultations/consultationSlice';
import regulationReducer from './regulations/regulationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    company: companyReducer,
    journal: journalReducer,
    attendance: attendanceReducer,
    consultation: consultationReducer,
    regulation: regulationReducer,
  },
});
