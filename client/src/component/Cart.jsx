import IcDelete from "../assets/image/iconDelete.png";
import IcPlus from "../assets/image/+.png";
import IcMin from "../assets/image/-.png";
import { Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { API } from "../config/api";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router";
import { ConvertFormatRupiah } from "../utils";
import { UserContext } from "../context/userContext";
import Swal from "sweetalert2";
import ModalShipping from '../component/ModalShipping';
import ModalSuccessShipping from "../component/ModalSuccessShipping";

function Cart() {
  let navigate = useNavigate();
  const [showShipping, setShowShipping] = useState(null);
  const [showSuccess, setShowsuccess] = useState(null);
  const handleShowShipping = () => setShowShipping(true);
  const handleCloseShipping = () => setShowShipping(false);

  const handleCloseSuccess = () => {
    setShowsuccess(false);
    navigate("/");
  };

  const popSuccess = () => {
    setShowsuccess(true)
    setShowShipping(false)
}

  const [message, setMessage] = useState(null);
  const [cart, setCart] = useState(false);
  const [state, dispatch] = useContext(UserContext);


  // untuk mendeklarasikan menjanjikan suatu kode
  let { data: carts, refetch: refetchCarts } = useQuery("cartsListCache", async () => {
    const response = await API.get("/carts");
    console.log(response.data.data);
    return response.data.data;
  });

  let { data: transaction, refetch: refetchTransaction } = useQuery("transactionsListCache", async () => {
    const response = await API.get("/transaction");
    return response.data.data;
  });
  const incrementCart = (id, orderQuantity, product_id) => {
    setCart({
      id: id,
      product_id: product_id,
      order_quantity: orderQuantity + 1,
    });
  };

  const decrementCart = (id, orderQuantity, product_id) => {
    setCart({
      id: id,
      product_id: product_id,
      order_quantity: orderQuantity - 1,
    });
  };

  const updateCart = useMutation(async (id) => {
    try {
      //Configuration API
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await API.patch(
        "/cart/" + id,
        {
          product_id: cart.product_id,
          order_quantity: cart.order_quantity,
        },
        config
      );

      setMessage(null);
      refetchCarts();
      setMessageCarts();
      refetchTransaction();
    } catch (error) {
      console.log(error.response.data.message);
      const newAlert = (
        <Alert variant="danger" className="py-1">
          {error.response.data.message}
        </Alert>
      );
      setMessage(newAlert);
      setMessageCarts();
    }
  });

  const deleteCart = useMutation(async (id) => {
    try {
      const response = await API.delete(`/cart/${id}`);
      refetchCarts();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Delete Success",
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.href = "/my-cart";
      window.dispatchEvent(new Event("badge"));
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (cart) {
      updateCart.mutate(cart.id);
    }
  }, [cart]);

  function setMessageCarts() {
    var index = carts.findIndex((x) => x.id === cart.id);
    carts[index].message = message;
    console.log("error:", message);
  }

  return (
    <>
      <Container>
        <Row className="custom-margin-top mx-5 responsive-margin-x">
          <h1 className="px-0 product-title">My Cart</h1>
          <p className="px-0 font-size-18px custom-text-primary">Review Your Order</p>
          <Row className="justify-content-between align-items-start px-0">
            <Col xs={12} lg={7}>
              {carts
                ?.filter((cart) => cart.user_id === state.user.id)
                ?.map((item, index) => {
                  return (
                    <Col key={index} xs={12} className="py-4 px-0 mb-4 animate__animated animate__slideInLeft" style={{ borderTop: "1px solid #613D2B", borderBottom: "1px solid #613D2B" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-wrap align-items-center">
                          <img src={`${item.product.photo}`} alt={item.name} className="me-3" style={{ width: "7.5rem" }} />
                          <div className="">
                            <h3 className="product-title font-size-18px mb-4"> {item.product.name} </h3>
                            <div className="d-flex align-items-center">
                              <img src={IcMin} onClick={() => decrementCart(item.id, item.order_quantity, item.product_id)} alt="Decrease Button" style={{ cursor: "pointer" }} />
                              <span className="font-size-18px custom-text-primar px-3 mx-3 rounded" style={{ backgroundColor: "#F6E6DA" }}>
                                {item.order_quantity}
                              </span>
                              <img src={IcPlus} onClick={() => incrementCart(item.id, item.order_quantity, item.product_id)} alt="Increase Button" style={{ cursor: "pointer" }} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="product-details font-size-18px mb-4">{ConvertFormatRupiah(item.product.price)} </div>
                          <div className="text-end">
                            <img src={IcDelete} alt="Delete Order" onClick={() => deleteCart.mutate(item.id)} style={{ cursor: "pointer" }} />
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Col>
            <Col xs={12} lg={4} className="py-4 px-0 ms-2 animate__animated animate__slideInRight" style={{ borderTop: "1px solid #613D2B" }}>
              <div className="d-flex justify-content-between mb-4 font-size-18px">
                <div className="product-details"> Subtotal </div>
                <div className="product-details">
                  {" "}
                  {ConvertFormatRupiah(carts?.filter((cart) => cart.user_id === state.user.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity * currentValue.product.price, 0))}{" "}
                </div>
              </div>
              <div className="d-flex justify-content-between pb-4 font-size-18px" style={{ borderBottom: "1px solid #613D2B" }}>
                <div className="product-details">Qty</div>
                <div className="product-details"> {carts?.filter((cart) => cart.user_id === state.user.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0)} </div>
              </div>
              <div className="d-flex justify-content-between mt-4 font-size-18px">
                <div className="product-details fw-bold">Total</div>
                <div className="product-details fw-bold">
                  {ConvertFormatRupiah(carts?.filter((cart) => cart.user_id === state.user.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity * currentValue.product.price, 0))}{" "}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-5">
                <Button onClick={handleShowShipping} variant="primary" size="lg" className="custom-btn-primary fw-bold font-size-18px w-75">
                  Pay
                </Button>
              </div>
            </Col>
          </Row>
        </Row>
      </Container>
      <ModalShipping show={showShipping} onHide={handleCloseShipping} handleSuccess={popSuccess} />
      <ModalSuccessShipping show={showSuccess} onHide={handleCloseSuccess} />
    </>
  );
}

export default Cart;
