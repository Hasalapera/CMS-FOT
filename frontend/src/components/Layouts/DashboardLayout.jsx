import { Outlet } from "react-router-dom";
import Sidebar from "../Common/SideBar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />

      <main className="min-h-screen lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;