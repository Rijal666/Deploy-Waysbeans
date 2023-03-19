import React, { useEffect, useState, useContext } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { Button, Nav, Navbar, Container, NavDropdown, Badge } from "react-bootstrap";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";
import Cart from "../assets/image/Cart.png";
import Profil from "../assets/image/Profil.png";
import User from "../assets/image/User.png";
import Logout from "../assets/image/Logout.png";
import IconAddProduct from "../assets/image/IconAddProduct.png";
import IconListProduct from "../assets/image/IconListProduct.png";
import { UserContext } from "../context/userContext";
import { API, setAuthToken } from "../config/api";
import { useQuery } from "react-query";
import Swal from "sweetalert2";

function Header() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // const [totalQty, setTotalQty] = useState(0);
  const [UserCarts, SetUserCarts] = useState([]);

  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/");
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      console.log("check user success : ", response);
      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;
      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      console.log("check user failed : ", error);
      dispatch({
        type: "AUTH_ERROR",
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleShowLogin = () => {
    handleClose(true);
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    handleClose(true);
    setShowRegister(true);
  };

  useQuery("usercartsCache", async () => {
    try {
      const response = await API.get("/carts");
      SetUserCarts(response.data.data);
    } catch (error) {
      return;
    }
  });

  // const fetchCart = () => {
  //   const dataCart = JSON.parse(localStorage.getItem("dataCart")) || [];
  //   let total = 0;

  //   dataCart.map((item) => {
  //     total = total + item.qty;
  //   });
  //   setTotalQty(total);
  // };

  // const [loginUsers, setLoginUsers] = useState({});
  // console.log(loginUsers);

  // useEffect(() => {
  //   fetchCart();
  //   const LoginUsers = JSON.parse(localStorage.getItem("loginUser")) || {};
  //   setLoginUsers(LoginUsers);

  //   window.addEventListener("storage", () => {
  //     fetchCart();
  //   });
  // }, []);

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logout Success",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/");
    // window.location.reload();
  };

  return (
    <>
      <Navbar bg="light" expand="lg" style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.25)" }}>
        <Container>
          <Navbar.Brand href="/">
            <img src="/image/Icon.png" style={{ width: "150px" }} alt="" />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            {state.isLogin === true ? (
              state.user.is_admin === true ? (
                <Nav className="ms-auto gap-3">
                  <NavDropdown title={<img src={Profil} alt="" style={{ content: "none" }} />}>
                    <NavDropdown.Item href="/add-product">
                      <img src={IconAddProduct} alt="" style={{ width: 40, height: 38.17 }} />
                      <span className="ms-2 fw-bold">Add Product</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/list-product">
                      <img src={IconListProduct} alt="" style={{ width: 40, height: 38.17 }} />
                      <span className="ms-2 fw-bold">List Product</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>
                      <img src={Logout} alt="" style={{ width: 40, height: 38.17 }} />
                      <span className="ms-2 fw-bold">Logout</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              ) : (
                <Nav className="ms-auto gap-3">
                  <NavLink to="/my-cart" className="position-relative d-inline-flex align-items-center">
                    <div className="me-3">
                      <img src={Cart} alt="" />
                    </div>
                    {UserCarts.filter((cart) => cart.user_id === User.id).length > 0 ? (
                      <Badge pill bg="danger" style={{ position: "absolute", top: 20, right: 5 }}>
                        {UserCarts.filter((cart) => cart.user_id === User.id).length}
                      </Badge>
                    ) : null}
                  </NavLink>

                  <NavDropdown title={<img src={Profil} alt="" />}>
                    <NavDropdown.Item href="/my-transaction">
                      <img src={User} alt="" style={{ width: 40, height: 38.17 }} />
                      <span className="ms-2 fw-bold">Profil</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>
                      <img src={Logout} alt="" style={{ width: 40, height: 38.17 }} />
                      <span className="ms-2 fw-bold">Logout</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )
            ) : (
              <Nav className="ms-auto gap-3">
                <NavLink to="">
                  <Button size="sm" className="ps-4 pe-4 px-4" variant="outline-light" onClick={handleShowLogin} style={{ border: "1px solid #613D2B", backgroundColor: "white", fontSize: 14, fontWeight: 700, color: "#613D2B" }}>
                    Login
                  </Button>
                </NavLink>
                <NavLink to="">
                  <Button size="sm" className="ps-4 pe-4 px-4" href="" style={{ backgroundColor: "#613D2B", fontSize: 14, fontWeight: 700, color: "white" }} variant="outline-light" onClick={handleShowRegister}>
                    Register
                  </Button>
                </NavLink>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ModalLogin show={showLogin} onHide={handleClose} onClick={handleShowRegister} />
      <ModalRegister show={showRegister} onHide={handleClose} onClick={handleShowLogin} />
    </>
  );
}

export default Header;
