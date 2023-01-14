import { sha512 } from "js-sha512";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import { getUserEmail, hasToken } from "../../common/api/auth";
import { addFile, getFileInfo, IFileInfo } from "../../common/api/files";
import { addUrl, getUrlInfo, IUrlInfo } from "../../common/api/url";
import CustomButton from "../../common/components/CustomButton/CustomButton";
import FileInfoModal from "../../common/components/InfoModals/FileInfoModal";
import UrlInfoModal from "../../common/components/InfoModals/UrlInfoModal";
import Page from "../../common/components/Page/Page";
import "./Home.css";

export default function Home() {
  // File and Url state
  const [file, setFile] = useState<File | null>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };

  const [url, setUrl] = useState<string>("");

  const [optionSelect, setOptionSelect] = useState<"file" | "url">("file");
  // End file and url state

  // Modals state
  const [showFileInfoModal, setShowFileInfoModal] = useState<boolean>(false);
  const [FileInfoModalData, setFileInfoModalData] = useState<IFileInfo | null>(null);

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
      if (file == null) {
        Swal.fire({
          title: "Error",
          text: "No file uploaded",
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          const fileData = new Uint8Array(reader.result as ArrayBuffer);

          try {
            let hash = sha512.create();
            hash.update(fileData);
            let hashValue = hash.hex().toUpperCase();

            await getFileInfo({
              fileSHA512Digest: hashValue,
            }).then((res: any) => {
              setFileInfoModalData(res.data);
              setShowFileInfoModal(true);
            });
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
        };
      }
    }
    if (optionSelect == "url") {
      if (!verifyUrl()) {
        Swal.fire({
          title: "Error",
          text: "Invalid url",
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        try {
          await getUrlInfo({
            urlAddress: url,
          }).then((res) => {
            setUrlInfoModalData(res.data);
            setShowUrlInfoModal(true);
          });
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
    if (file == null) {
      console.log("invalid");
      Swal.fire({
        title: "Error",
        text: "No file uploaded",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });
    } else if (optionSelect == "file") {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      let binData: number[] = [];
      reader.onload = async (e) => {
        const fileData = new Uint8Array(reader.result as ArrayBuffer);

        for (var i = 0; i < fileData.length; i++) {
          binData.push(fileData[i]);
        }

        try {
          const response = await addFile({
            userEmail: getUserEmail(),
            binData: binData,
            fileName: file.name,
          });

          if (response.data.search("is already present in the database") != -1) {
            Swal.fire({
              title: "Error",
              text: "File is already present",
              icon: "error",
              showConfirmButton: false,
              timer: 2500,
            }).then(() => {
              setFile(null);
            });
            return;
          }

          Swal.fire({
            title: "Success",
            text: "File added successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            setFile(null);
          });
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
      };
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

          <div className="m-2">
            <CustomButton onClick={() => buttonHandler("analyze")} text="Analyze" />
          </div>

          {hasToken() && (
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

      {FileInfoModalData && (
        <FileInfoModal
          show={showFileInfoModal}
          onHide={() => {
            setShowFileInfoModal(false);
            setFileInfoModalData(null);
          }}
          fileInfo={FileInfoModalData}
        />
      )}
    </>
  );
}
