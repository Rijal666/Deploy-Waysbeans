import { Modal, Alert } from "react-bootstrap";

export default function ModalSuccessAddProduct(props) {

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Body className=" m-auto p-0 w-100">
                    <div >
                        <Alert className="w-100 m-auto fs-2" style={{ textAlign: "center" }} variant="success">
                            Thank you for ordering in us, please wait 1 x 24 hours to verify you order
                        </Alert>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}