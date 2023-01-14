import { Modal, ProgressBar } from "react-bootstrap";
import { IUrlInfo } from "../../api/url";

interface UrlInfoModalProps {
  show: boolean;
  onHide: () => void;
  urlInfo: IUrlInfo;
}

export default function UrlInfoModal(props: UrlInfoModalProps) {
  const { urlInfo, ...rest } = props;

  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">The analysis of the URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="h5">URL:</p>
        <p className="h6">{urlInfo.addr}</p>
        {urlInfo.aliases.length > 0 && (
          <>
            <h4 className="h5 mt-3">URL Aliases:</h4>
            <ul>
              {urlInfo.aliases.map((alias) => (
                <li>{alias}</li>
              ))}
            </ul>
          </>
        )}
        <p className="h5 mt-3">URL Security level:</p>
        {urlInfo.securityLevel === "" ? (
          <p className="h6 text-danger">No Data</p>
        ) : (
          <ProgressBar now={Number(urlInfo.securityLevel)} />
        )}
      </Modal.Body>
    </Modal>
  );
}