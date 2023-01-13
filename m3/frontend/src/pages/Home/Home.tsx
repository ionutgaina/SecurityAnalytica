import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import { getUserEmail, hasToken } from "../../common/api/auth";
import { addUrl, getUrlInfo, IUrlInfo } from "../../common/api/url";
import CustomButton from "../../common/components/CustomButton/CustomButton";
import { FileInfoModal } from "../../common/components/InfoModals/FileInfoModal";
import UrlInfoModal from "../../common/components/InfoModals/UrlInfoModal";
import Page from "../../common/components/Page/Page";
import "./Home.css";

export default function Home() {
  // File and Url state
  const [file, setFile] = useState<any>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };

  const [url, setUrl] = useState<string>("");

  const [optionSelect, setOptionSelect] = useState<"file" | "url">("file");
  // End file and url state

  // Modals state
  const [showFileInfoModal, setShowFileInfoModal] = useState<boolean>(false);
  const [FileInfoModalData, setFileInfoModalData] = useState<any>(null);

  const [showUrlInfoModal, setShowUrlInfoModal] = useState<boolean>(false);
  const [UrlInfoModalData, setUrlInfoModalData] = useState<IUrlInfo | null>(null);
  // End modals state

  function buttonHandler(type: string) {
    if (type == "analyze") {
      analyzeHandler();
    } else if (type == "add") {
      addHandler();
    }
  }

  async function analyzeHandler() {
    if (optionSelect == "file") {
      console.log("analyze file");
    }
    if (optionSelect == "url") {
      console.log("analyze url");
      if (!verifyUrl()) {
        Swal.fire({
          title: "Error",
          text: "Invalid url",
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          setUrl("");
        });
      } else {
        try {
          await getUrlInfo({
            urlAddress: url,
          }).then((res) => {
            setUrlInfoModalData(res.data);
          });

          setShowUrlInfoModal(true);
        } catch (e: any) {
          let response = e.response?.data?.statusMessage;
          response = response.replace("[Error] ", "");

          Swal.fire({
            title: "Error",
            text: response,
            icon: "error",
            showConfirmButton: false,
            timer: 2500,
          });
        }
      }
    }
  }

  async function addHandler() {
    if (optionSelect == "file") {
      console.log("add file");
    }

    if (optionSelect == "url") {
      if (!verifyUrl()) {
        console.log("invalid");
        Swal.fire({
          title: "Error",
          text: "Invalid url",
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          setUrl("");
        });
      } else {
        try {
          const response = await addUrl({
            urlAddress: url,
            userEmail: getUserEmail(),
          });

          if (response.data.search("is already present in the database") != -1) {
            Swal.fire({
              title: "Error",
              text: "Url is already present",
              icon: "error",
              showConfirmButton: false,
              timer: 2500,
            }).then(() => {
              setUrl("");
            });
            return;
          }

          Swal.fire({
            title: "Success",
            text: "Url added successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            setUrl("");
          });
        } catch (e: any) {
          console.log(e);

          let response = e.response?.data?.statusMessage;
          response = response.replace("[Error] ", "");

          Swal.fire({
            title: "Error",
            text: response,
            icon: "error",
            showConfirmButton: false,
            timer: 2500,
          });
        }
      }
    }
  }

  function verifyUrl() {
    return /^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
  }

  return (
    <>
      <Page>
        <div className="container">
          <h1 className="row d-flex justify-content-center">Analyze and Secure</h1>
          <ul className="list-group list-group-horizontal d-flex justify-content-center">
            <li
              onClick={() => {
                setOptionSelect("file");
              }}
              className={`list-group-item w-25 ${optionSelect == "file" && "active-option"}`}
            >
              FILE
            </li>
            <li
              onClick={() => {
                setOptionSelect("url");
              }}
              className={`list-group-item w-25 ${optionSelect == "url" && "active-option"}`}
            >
              URL
            </li>
          </ul>
          {/* File option */}
          {optionSelect == "file" && (
            <div className="row d-flex justify-content-center mt-3">
              <FileUploader handleChange={handleChange} name="file" />
              {file ? (
                <>
                  <p>
                    File name: ${file.name}{" "}
                    <i onClick={() => setFile(null)} className="bi bi-x-lg text-danger icon-x"></i>
                  </p>
                </>
              ) : (
                <p>No file uploaded yet</p>
              )}
            </div>
          )}
          {/* Url option */}
          {optionSelect == "url" && (
            <div className="row d-flex justify-content-center mt-3">
              <div className="w-75 mb-3">
                <input
                  name="url"
                  type="text"
                  className="form-control"
                  placeholder="write your url here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Buttons logic */}
          {(file || optionSelect == "url") && (
            <div className="m-2">
              <CustomButton onClick={() => buttonHandler("analyze")} text="Analyze" />
            </div>
          )}
          {(file || optionSelect == "url") && hasToken() && (
            <div className="m-2">
              <CustomButton onClick={() => buttonHandler("add")} text={`Add ${optionSelect}`} />
            </div>
          )}
        </div>
      </Page>

      {/* Modals */}
      {UrlInfoModalData && (
        <UrlInfoModal
          show={showUrlInfoModal}
          onHide={() => {
            setShowUrlInfoModal(false);
            setUrlInfoModalData(null);
          }}
          urlInfo={UrlInfoModalData}
        />
      )}
    </>
  );
}
