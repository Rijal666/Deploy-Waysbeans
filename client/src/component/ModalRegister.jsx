import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/api";
import Swal from "sweetalert2";

export const Register = (props) => {
  // const title = "Home"
  // document.title = "Waysbeans | " + title;

  const [formRegister, setFormRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formRegister;

  const onChangeHandler = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post("/register", formRegister);

      console.log("register success : ", response);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Register Success",
        showConfirmButton: false,
        timer: 1500,
      });
      setFormRegister({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Register Failed",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("register failed : ", error);
    }

    props.onHide();
  });

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   console.log(formRegister);

  //   const dataUsers = JSON.parse(localStorage.getItem("users"));
  //   console.log(dataUsers);

  //   if (dataUsers === null) {
  //     localStorage.setItem("users", JSON.stringify([formRegister]));
  //   } else {
  //     dataUsers.push(formRegister);
  //     localStorage.setItem("users", JSON.stringify(dataUsers));
  //   }

  //   props.onHide();
  // };

  return (
    <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <div className="px-5 pb-3">
        <p className="fs-3 fw-bold" style={{ color: "#613D2B", paddingTop: 45 }}>
          Register
        </p>
        <Form className="mt-4" onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              className="p-2 mb-3"
              type="email"
              required
              name="email"
              value={email}
              placeholder="Email"
              onChange={onChangeHandler}
              style={{
                textColor: "#613D2B",
                backgroundColor: "rgba(97, 61, 43, 0.25)",
                border: "2px solid #613D2B",
              }}
            />

            <Form.Control
              className="p-2 mb-3"
              required
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChangeHandler}
              style={{
                backgroundColor: "rgba(97, 61, 43, 0.25)",
                border: "2px solid #613D2B",
              }}
            />

            <Form.Control
              className="p-2 mb-3"
              required
              type="text"
              name="name"
              value={name}
              placeholder="Full Name"
              onChange={onChangeHandler}
              style={{
                backgroundColor: "rgba(97, 61, 43, 0.25)",
                border: "2px solid #613D2B",
              }}
            />
          </Form.Group>

          <Button type="submit" className="fw-bold border-0 w-100 py-2 mt-3" style={{ backgroundColor: "#613D2B" }}>
            Register
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account ? Klik{" "}
          <span onClick={props.onClick} className="fw-bold" style={{ cursor: "pointer" }}>
            Here
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default Register;
