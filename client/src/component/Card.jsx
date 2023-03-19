import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
// import DataProduct from "../assets/data/data.json";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { ConvertFormatRupiah } from "../utils";

const Home = () => {

  // Fetching product data from database
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  let asceding = []
  if (products !== undefined) {
    asceding = [...products]
    asceding.sort((a,b) => b.id - a.id)
  }

  return (
    <>
      <Container className="d-flex my-3 gap-4 row-cols-4" style={{ marginLeft: 170 }}>
      {asceding?.map((item) => {
        return (
          <div key={item.id} className="my-3 mb-5" style={{ backgroundColor: "#F7E6DA", width: 241, height: 410 }}>
            <Link className="text-decoration-none" to={`/detail-product/${item.id}`}>
              <Card.Img variant="top" src={`${item.photo}`} to="/detail-product" />
              <Card.Body style={{ color: "#613D2B", fontSize: 14 }}>
                <Card.Title className="fw-bold" style={{marginTop: 14, marginLeft: 13, color: "#613D2B"}} >{item.name}</Card.Title>
                <Card.Text>
                  <p style={{ marginTop: "11px", marginLeft: 16, color: "#613D2B" }}>Price: {ConvertFormatRupiah(item.price)}</p>
                  <p style={{ marginTop: "-6%", marginLeft: 16, color: "#613D2B" }}>Stock: {item.stock}</p>
                </Card.Text>
              </Card.Body>
            </Link>
          </div>
          );
        })}
      </Container>
    </>
  );
}

export default Home;
