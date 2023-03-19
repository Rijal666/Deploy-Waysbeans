import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from 'sweetalert2'

import { useMutation } from 'react-query';
import { API, setAuthToken } from "../config/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/contextUser";

const ModalEditProfile = (props) => {
  let navigate = useNavigate();

  const {showEdit, hideEdit} = props
  // agar submit tidak merefresh

  const [_, dispatch] = useContext(UserContext);
  console.log(_);

  const [formLogin, setFormLogin] = useState({
    name: "",
    email: "",
    password: "",
    phone : "",
    address : "",
  });
  const ChangeLogin = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitLogin = useMutation(async (e) => {
    try {
      e.preventDefault();
  
      const response = await API.post('/login', formLogin);
  
      console.log("login success : ", response)

      // Send data to useContext
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.data,
      });
      setAuthToken(response.data.data.token);
  
      setFormLogin({
        email: '',
        password: '',
      });
      hideEdit()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login Success',
        showConfirmButton: false,
        timer: 1500
      })

      // Status check
      if (response.data.data.role === 'admin') {
        navigate('/list-income');
      } else if (response.data.data.role === 'user') {
        navigate('/profile');
        window.location.reload();
      } else {
        navigate('/')
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Login Failed',
        showConfirmButton: false,
        timer: 1500
      })
    }
  });


  return (
    <div>
      <Modal show={showEdit} onHide={hideEdit} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#613D2B", fontWeight: "900" }}>
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => SubmitLogin.mutate(e)}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Full Name" name="name" className="formInput" value={formLogin.name} onChange={ChangeLogin} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Email" name="email" className="formInput" value={formLogin.email} onChange={ChangeLogin} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" placeholder="Password" name="password" className="formInput" value={formLogin.password} onChange={ChangeLogin} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Phone" name="phone" className="formInput" value={formLogin.phone} onChange={ChangeLogin} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control type="text" placeholder="Address" name="address" className="formInput" value={formLogin.address} onChange={ChangeLogin} />
            </Form.Group>
            <Button variant="secondary col-12" type="submit" style={{ backgroundColor: "#613D2B" }}>
              Save Change
            </Button>
              <p style={{ color: "red", textAlign: "center" }}>
              </p>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalEditProfile;