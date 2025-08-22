import AppRoutes from "../../app/routes";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 min-h-screen w-full min-w-0 pt-14 md:pt-0">
        <Topbar />
        <div className="pt-14 md:pt-0 mx-auto w-full max-w-7xl p-4 md:mt-4">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}
