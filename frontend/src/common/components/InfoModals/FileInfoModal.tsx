import { Modal, ProgressBar } from "react-bootstrap";
import { IFileInfo } from "../../api/files";

interface FileInfoModalProps {
  show: boolean;
  onHide: () => void;
  fileInfo: IFileInfo;
  deleteAction?: (digest: string) => void;
}

export default function FileInfoModal(props: FileInfoModalProps) {
  const { fileInfo, deleteAction, ...rest } = props;

  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">The analysis of the File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="h5">File Name:</p>
        <p className="h6">{fileInfo.fileName}</p>
        <p className="h5">File Digest:</p>
        <p className="h6 text-break">{fileInfo.digest}</p>
        <p className="h5 mt-3 ">File Security level:</p>

        <ProgressBar
          now={
            fileInfo.securityLevel === ""
              ? randomIntFromInterval(0, 100)
              : Number(fileInfo.securityLevel)
          }
        />
      </Modal.Body>
      {deleteAction && (
        <Modal.Footer>
          <button onClick={() => deleteAction(fileInfo.digest)} className="btn btn-danger">
            Delete the file
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
