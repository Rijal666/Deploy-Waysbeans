import React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tmb from "../assets/image/Thumbnail.png";
import { Button, Form } from "react-bootstrap";

import { API } from "../config/api";
import { useMutation } from "react-query";
import Swal from 'sweetalert2';

function UpdateProduct() {
  // let navigate = useNavigate();

  // const params = useParams();
  // const id = parseInt(params.id);
  // const [imageUrl, setImageUrl] = useState("/image/product-placeholder.webp");

  // const [addProduct, setAddProduct] = useState({
  //   name: "",
  //   stok: "",
  //   price: "",
  //   description: "",
  //   photo: "",
  // });

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   const imageUrl = URL.createObjectURL(file);
  //   setImageUrl(imageUrl);
  // };

  // const fetchProduct = () => {
  //   const getProduct = JSON.parse(localStorage.getItem("dataProduct"));
  //   const findProduct = getProduct.find((product) => product.id === id);
  //   setAddProduct({
  //     ...findProduct,
  //   });
  // };

  // useEffect(() => {
  //   fetchProduct();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const onChangeHandler = (e) => {
  //   setAddProduct({
  //     ...addProduct,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();

  //   // const newProduct = {
  //   //   ...addProduct,
  //   //   photo: imageUrl,
  //   // };

  //   const dataProduct = JSON.parse(localStorage.getItem("dataProduct"));

  //   const indexProduct = dataProduct.findIndex((item) => item.id === id);
  //   dataProduct[indexProduct] = addProduct;
  //   localStorage.setItem("dataProduct", JSON.stringify(dataProduct));
  // };

  let navigate = useNavigate();
  const { id } = useParams();

  const [imageUrl, setImageUrl] = useState("");
  const [formUpdateProduct, setForm] = useState({
    photo: '',
    name: '',
    description: '',
    price: '',
    stock: '',
  }); //Store product data

  async function getDataUpdate() {
    const responseProduct = await API.get('/product/' + id);
    setImageUrl(responseProduct.data.data.photo);

    setForm({
      ...formUpdateProduct,
      name: responseProduct.data.data.name,
      description: responseProduct.data.data.description,
      price: responseProduct.data.data.price,
      stock: responseProduct.data.data.stock,
    });
  }

  useEffect(() => {
    getDataUpdate()
  }, []);

   // Handle change data on form
   const handleChange = (e) => {
    setForm({
      ...formUpdateProduct,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (formUpdateProduct.photo) {
        formData.set('photo', formUpdateProduct?.photo[0], formUpdateProduct?.photo[0]?.name);
      }
      formData.set('name', formUpdateProduct.name);
      formData.set('description', formUpdateProduct.description);
      formData.set('price', formUpdateProduct.price);
      formData.set('stock', formUpdateProduct.stock);

      // await disini berfungsi untuk menunggu sampai promise tersebut selesai dan mengembalikkan hasilnya
      const response = await API.patch(
        '/product/' + id,
        formData,
        config
      );
      console.log(response.data);

      navigate('/list-product');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Update Product Success',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <div className="container d-flex justify-content-around align-items-center my-5" style={{ marginTop: 46 }}>
        <div style={{ width: 472 }}>
          <p className="fw-bold fs-3" style={{ color: "#613D2B", marginBottom: 31 }}>
            Add Product
          </p>

          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <div class="mb-3">
              <input
                type="text"
                className="form-control p-2"
                name="name"
                placeholder="Name"
                value={formUpdateProduct.name}
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
                placeholder="Stock"
                value={formUpdateProduct.stock}
                onChange={handleChange}
                id="stok"
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
                placeholder="Price"
                value={formUpdateProduct.price}
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
                placeholder="Description Product"
                value={formUpdateProduct.description}
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
                  <Form.Control name="photo" onChange={handleChange} type="file" hidden placeholder="Photo Product" cursor="pointer"/>
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
                Update Product
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

export default UpdateProduct;
