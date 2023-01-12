import { Modal } from "react-bootstrap";
import RegisterForm from "./components/SignUpForm";

interface SignUpModalProps {
  show: boolean;
  onHide: () => void;
  showLoginModal: () => void;
}

export default function SignUpModal(props: SignUpModalProps) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RegisterForm onhideSignUpModal={props.onHide} showLoginModal={props.showLoginModal}/>
      </Modal.Body>
    </Modal>
  );
}
