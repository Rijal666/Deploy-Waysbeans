import Header from "../component/Header";
import TransactionProfil from "../component/Transaction";
import Profile from "../component/Profile";

function Transaction() {
  return (
    <div className="MyTransaction">
      <Header />
      <div className="container" style={{ marginTop: 77 }}>
        <div className="d-flex justify-content-between" style={{ padding: "0 0px" }}>
          <Profile />
          <TransactionProfil />
        </div>
      </div>
    </div>
  );
}

export default Transaction;
