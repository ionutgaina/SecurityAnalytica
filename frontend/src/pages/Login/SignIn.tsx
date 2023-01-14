import { Modal } from "react-bootstrap";
import RegisterForm from "./components/SignInForm";

interface SignUpModalProps {
  show: boolean;
  onHide: () => void;
}

export default function SignInModal(props: SignUpModalProps) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RegisterForm onHideLoginModal={props.onHide} />
      </Modal.Body>
    </Modal>
  );
}
