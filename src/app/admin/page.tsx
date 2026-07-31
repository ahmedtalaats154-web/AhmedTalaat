import AdminDashboard from "./AdminDashboard";
import "./admin.css";

export const metadata = {
  title: "PLAY/EDIT — Site Control",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}

