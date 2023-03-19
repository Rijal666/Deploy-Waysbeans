import Header from "../component/Header";
import ListProducts from "../component/Dashboard";

function AdminDashboard() {
  return (
    <div className="AdminDashboard">
      <Header />
      <ListProducts />
    </div>
  );
}

export default AdminDashboard;
