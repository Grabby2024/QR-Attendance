import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AttendanceScanner from "./pages/AttendanceScanner";

// Admin Components
import Home from "./pages/components/Home";
import Offices from "./pages/components/Offices";
import Statistical_Data from "./pages/components/Statistical_Data";
import ListofAttendance from "./pages/components/ListofAttendance"; // ✅ match file name exactly

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Home />} /> {/* /admin */}
          <Route path="offices" element={<Offices />} /> {/* /admin/offices */}
          <Route path="statistics" element={<Statistical_Data />} /> {/* /admin/statistics */}
          <Route path="attendance-list" element={<ListofAttendance />} /> {/* /admin/attendance-list */}
        </Route>

        {/* Scanner route (not part of admin) */}
        <Route path="/scanner/:officeId" element={<AttendanceScanner />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
