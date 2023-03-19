import { Button, Modal } from 'react-bootstrap'

export default function DeleteData({ show, handleClose, setConfirmDelete }) {

    const handleDelete = () => {
        setConfirmDelete(true)
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="text-dark">
                <div style={{ fontSize: '20px', fontWeight: '900' }}>
                    Delete Product
                </div>
                <div style={{ fontSize: '16px', fontWeight: '500' }} className="mt-2">
                    Are you sure you want to delete this product?
                </div>
                <div className="text-end mt-5">
                    <Button onClick={handleDelete} size="sm" className="btn-success me-2" style={{ width: '135px' }}>Yes, Delete</Button>
                    <Button onClick={handleClose} size="sm" className="btn-danger" style={{ width: '135px' }}>No, Keep it</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
