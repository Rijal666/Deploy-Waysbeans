import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useMutation } from "react-query";
// import { useNavigate } from "react-router";
import { API } from "../config/api";


const style = {
    textInput: {
        height: "50px",
        backgroundColor: "#D7CECA",

        border: "solid 2px #613D2B",
        fontSize: "18px"
    },
}


export default function Shipping(props) {
   
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            };

            const formData = new FormData();
            formData.set('name', form.name);
            formData.set('email', form.email);
            formData.set('phone', form.phone);
            formData.set('address', form.address);

            let formDataObject = {};
            for (const [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }
            const formDataJSON = JSON.stringify(formDataObject);
            const response = await API.post('/transaction', formDataJSON, config);
            console.log("success shipping: ",response.data.data.token);
            const token = response.data.data.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                    console.log(result);
                    window.dispatchEvent(new Event("badge"));
                    props.handleSuccess();
                },
                onPending: function (result){
                    console.log(result);
                    window.dispatchEvent(new Event("badge"));
                    props.handleSuccess();
                },
                onError: function (result){
                    console.log(result);
                    window.dispatchEvent(new Event("badge"));
                    props.handleSuccess();
                },
                onClose: function(){
                    alert("you closed the popup without finishing the payment");
                }
            })
            
        } catch (error) {
            console.log("transaction failed: ", error)
        }
    });

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    return (
        <>
            <Container>
                <h3 className="mb-5">Shipping</h3>
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <Form.Control
                        onChange={handleChange}
                        name="name"
                        type="text"
                        style={style.textInput}
                        placeholder="Name"
                        className="mb-3 w-100 fs-5"
                    />
                    <Form.Control
                        onChange={handleChange}
                        name="email"
                        type="email"
                        style={style.textInput}
                        placeholder="Email"
                        className="mb-3 w-100 fs-5"
                    />
                    <Form.Control
                        onChange={handleChange}
                        name="phone"
                        type="text"
                        style={style.textInput}
                        placeholder="Phone"
                        className="mb-3 w-100 fs-5"
                    />
                    <Form.Control
                        onChange={handleChange}
                        name="address"
                        type="text"
                        style={style.textInput}
                        placeholder="Address"
                        className="mb-3 w-100 fs-5"
                    />
                    <Button className="custom-btn-primary w-100 m-auto justify-content-center d-flex" type="submit">
                        Confirm
                    </Button>
                </Form>
            </Container>

           
        </>
    )
}