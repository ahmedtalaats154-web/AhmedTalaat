import AdminGate from "./AdminGate";
import "./admin.css";
import "./legacy-login.css";

export const metadata = {
  title: "PLAY/EDIT — Site Control",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminGate />;
}
