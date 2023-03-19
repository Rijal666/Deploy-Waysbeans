import { React, useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { API } from "../config/api";
import { useQuery } from "react-query";
import { UserContext } from "../context/userContext";

function ListProduct() {
  const [state, _] = useContext(UserContext);
  let { data: transaction } = useQuery("transactionCache", async () => {
    const response = await API.get("/transactions");
    console.log(response.data.data);
    return response.data.data;
  });

  return (
    <Container>
      <h1 className="custom-margin-top product-title font-size-36px mb-5">Income Transaction</h1>
      <Table responsive bordered hover className="mx-auto animate__animated animate__fadeIn">
        <thead style={{ backgroundColor: "#E5E5E5" }}>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transaction?.map((item, index) => (
            <tr key={item.id}>
              <td> {index + 1} </td>
              <td> {item.name} </td>
              <td> {item.email} </td>
              <td> {item.phone} </td>
              <td> {item.address} </td>
              {item.status === "pending" && <td style={{ color: "#FF9900" }}>{item.status}</td>}
              {item.status === "success" && <td style={{ color: "#78A85A" }}>{item.status}</td>}
              {item.status === "failed" && <td style={{ color: "#E83939" }}>{item.status}</td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ListProduct;
