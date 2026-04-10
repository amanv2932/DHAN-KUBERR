import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1 lg:pl-80">
        <Navbar />

        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
