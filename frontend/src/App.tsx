import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import DashboardLayout from "./components/DashboardLayout";
import AppTheme from "./shared-theme/AppTheme";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
  sidebarCustomizations,
} from "./components/theme/customizations";

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function App(props: { disableCustomTheme?: boolean }) {
  return (
    <>
      <AppTheme {...props} themeComponents={themeComponents}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Tasks />} />
              <Route path="/create" element={<CreateTask />} />
            </Route>
          </Route>
        </Routes>
      </AppTheme>
    </>
  );
}
