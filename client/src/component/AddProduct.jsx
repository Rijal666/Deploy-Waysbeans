import React from "react";

import { useState } from "react";

import Tmb from "../assets/image/Thumbnail.png";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useMutation } from "react-query";
import { API } from "../config/api";

function AddProduct() {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("/image/product-placeholder.webp");

  const [formAddProduct, setformAddProduct] = useState({
    id: 0,
    name: "",
    stock: "",
    price: "",
    description: "",
    photo: "",
  });

  // Handle change data on form
  const handleChange = (e) => {
    setformAddProduct({
      ...formAddProduct,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url);
    }
  };

  const submitAddProduct = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      formData.set("photo", formAddProduct.photo[0], formAddProduct.photo[0].name);
      formData.set("name", formAddProduct.name);
      formData.set("description", formAddProduct.description);
      formData.set("price", formAddProduct.price);
      formData.set("stock", formAddProduct.stock);

      // Insert product data
      const response = await API.post("/product", formData, config);
      console.log("add product success : ", response);

      navigate("/list-product");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Add Product Success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Add Product Failed",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("add product failed : ", error);
    }
  });

  return (
    <div>
      <div className="container d-flex justify-content-around align-items-center my-5" style={{ marginTop: 46 }}>
        <div style={{ width: 472 }}>
          <p className="fw-bold fs-3" style={{ color: "#613D2B", marginBottom: 31 }}>
            Add Product
          </p>

          <form onSubmit={(e) => submitAddProduct.mutate(e)}>
            <div class="mb-3">
              <input
                type="text"
                className="form-control p-2"
                name="name"
                value={formAddProduct.name}
                placeholder="Name"
                onChange={handleChange}
                id="name"
                style={{
                  textColor: "#613D2B",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #613D2B",
                }}
              />
            </div>

            <div class="mb-3">
              <input
                type="number"
                className="form-control p-2"
                name="stock"
                value={formAddProduct.stock}
                placeholder="Stock"
                onChange={handleChange}
                id="stock"
                style={{
                  textColor: "#613D2B",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #613D2B",
                }}
              />
            </div>

            <div class="mb-3">
              <input
                type="number"
                className="form-control p-2"
                name="price"
                value={formAddProduct.price}
                placeholder="Price"
                onChange={handleChange}
                id="price"
                style={{
                  textColor: "#613D2B",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #613D2B",
                }}
              />
            </div>

            <div class="mb-3">
              <textarea
                className="form-control p-2"
                name="description"
                value={formAddProduct.description}
                placeholder="Description Product"
                onChange={handleChange}
                id="description"
                style={{ height: 150, resize: "none", textColor: "#613D2B", backgroundColor: "rgba(97, 61, 43, 0.25)", border: "2px solid #613D2B" }}
              ></textarea>
            </div>

            <Form.Group
              controlId="formFile"
              className=""
              style={{
                textColor: "#613D2B",
                backgroundColor: "rgba(97, 61, 43, 0.25)",
                border: "2px solid #613D2B",
                borderRadius: 5,
                width: 190,
                height: 50,
              }}
            >
              <Form.Label className="d-flex">
                <div className="d-flex justify-content-between align-text-center">
                  <Form.Control name="photo" type="file" hidden placeholder="Photo Product" cursor="pointer" onChange={handleChange} />
                  <p className="m-0 mt-2 ms-2" style={{ color: "grey" }}>
                    Photo Product
                  </p>
                </div>
                <div className="d-flex ms-4 mt-2">
                  <img src={Tmb} alt="" />
                </div>
              </Form.Label>
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                type="submit"
                variant="outline-light"
                className="btn"
                style={{
                  backgroundColor: "#613D2B",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  width: 260,
                  height: 40,
                  marginTop: 66,
                }}
              >
                Add Product
              </Button>
            </div>
          </form>
        </div>
        <div style={{ width: 436, height: 555 }}>
          <img src={imageUrl} style={{ width: "100%" }} alt="imageadmin" />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
