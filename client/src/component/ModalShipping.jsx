import { Modal } from "react-bootstrap";
import Shipping from "../component/Shipping";

export default function ModalShipping(props) {
    return (
        <>
            <Modal show={props.show} onHide={props.onHide} handleSuccess={props.handleSuccess} centered>
                <Modal.Body>
                    <Shipping onHide={props.onHide} handleSuccess={props.handleSuccess}/>
                </Modal.Body>
            </Modal>
        </>
    )
}