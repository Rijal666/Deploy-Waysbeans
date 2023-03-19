import React from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API } from "../config/api";
import { useQuery, useMutation } from 'react-query';
import Swal from 'sweetalert2'
import DeleteData from "../component/ModalDeleteProduct";

function ListProduct() {
  const navigate = useNavigate()

  // Variabel for delete product data
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Modal Confirm delete data
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // For get id product & show modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  let { data: products, refetch } = useQuery("productsAdminCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });
    // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
     const response = await API.delete(`/product/${id}`);
     console.log(response)
      refetch();
      navigate("/list-product")
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Delete Success',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Delete Failed',
        showConfirmButton: false,
        timer: 1500
      })
      console.log(error);
    }
  });

  const handleUpdate = (id) => {
    navigate(`/update-product/${id}`);
  };

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
      // window.location.reload();
    }
  }, [confirmDelete]);

  let asceding = []
  if (products !== undefined) {
    asceding = [...products]
    asceding.sort((a,b) => b.id - a.id)
  }

  return (
    <>
    <Container>
      <h1 className="custom-margin-top product-title font-size-36px mb-5">List Product</h1>
        <Table responsive bordered hover className="mx-auto w-100 animate__animated animate__fadeIn">
          <thead style={{ backgroundColor: "#E5E5E5" }}>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {asceding?.map((item, index) => {
            return (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  <img src={`${item.photo}`} alt={item.name} style={{width:"50px", height:"50px"}} />
                </td>
                <td >{item.name}</td>
                <td >{item.stock}</td>
                <td >{item.price}</td>
                <td style={{ textAlign: "justify" }}>{item.description}</td>
                <td className="text-center" style={{ width: "15rem" }}>
                  <Button onClick={() => handleDelete(item.id)} variant="danger" className="py-0 me-2 button-delete mb-2" style={{ width: "48%" }}>
                    delete
                  </Button>
                  <Button onClick={() => handleUpdate(item.id)} variant="success" className="py-0 button-update mb-2" style={{ width: "48%" }}>
                    update
                  </Button>
                </td>
              </tr>
            )
            })}
          </tbody>
        </Table>
    </Container>
    <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}

export default ListProduct;
