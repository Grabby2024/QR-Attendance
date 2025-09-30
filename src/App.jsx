import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AttendanceScanner from "./pages/AttendanceScanner";

//Aadmin Components
import Home from "./pages/components/Home";
import Offices from "./pages/components/Offices";
import Statistical_Data from "./pages/components/Statistical_Data";
import ListOfAttendance from "./pages/components/ListOfAttendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Home />} /> {/* /admin */}
          <Route path="offices" element={<Offices />} /> {/* /admin/offices */}
          <Route path="statistics" element={<Statistical_Data />} /> {/* /admin/statistics */}
          <Route path="attendance-list" element={<ListOfAttendance />} /> {/* /admin/attendance-list */}
        </Route>

        {/* Scanner route (not part of admin) */}
        <Route path="/scanner" element={<AttendanceScanner />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
