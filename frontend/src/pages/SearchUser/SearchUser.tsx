import { useState } from "react";
import Swal from "sweetalert2";
import { getUserFiles, IFileInfo } from "../../common/api/files";
import { getUserUrls, IUrlInfo } from "../../common/api/url";
import CustomButton from "../../common/components/CustomButton/CustomButton";
import FileInfoModal from "../../common/components/InfoModals/FileInfoModal";
import UrlInfoModal from "../../common/components/InfoModals/UrlInfoModal";
import Page from "../../common/components/Page/Page";
import "./SearchUser.css";

interface IUserData {
  urls: IUrlInfo[];
  files: IFileInfo[];
}

export function SearchUser() {
  const [userEmailInput, setUserEmailInput] = useState<string>("");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // Modals state
  const [showFileInfoModal, setShowFileInfoModal] = useState<boolean>(false);
  const [FileInfoModalData, setFileInfoModalData] = useState<IFileInfo | null>(null);

  const [showUrlInfoModal, setShowUrlInfoModal] = useState<boolean>(false);
  const [UrlInfoModalData, setUrlInfoModalData] = useState<IUrlInfo | null>(null);
  // End modals state

  const urlInfoHandler = (urlInfo: IUrlInfo) => {
    setUrlInfoModalData(urlInfo);
    setShowUrlInfoModal(true);
  };

  const fileInfoHandler = (fileInfo: IFileInfo) => {
    setFileInfoModalData(fileInfo);
    setShowFileInfoModal(true);
  };


  const searchHandler = async () => {
    console.log(userEmailInput);
    if (!verifyEmail(userEmailInput)) {
      Swal.fire({
        title: "Error",
        text: "Invalid email",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });
      setUserData(null);
      setUserEmail("");
      return;
    }

    try {
      const urlsResponse = await getUserUrls({ userEmail: userEmailInput });
      const filesResponse = await getUserFiles({ userEmail: userEmailInput });
      const userDataVar: IUserData = {
        urls: urlsResponse.data,
        files: filesResponse.data,
      };

      setUserData(userDataVar);
      setUserEmail(userEmailInput);
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

  return (
    <>
      <Page>
        <>
          <div className="container">
            <h1 className="row d-flex justify-content-center">Search user</h1>
            <div className="row d-flex justify-content-center mt-3">
              <div className="w-75 mb-3">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="write the user email here"
                  value={userEmailInput}
                  onChange={(e) => setUserEmailInput(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons logic */}
            <div className="m-2">
              <CustomButton onClick={() => searchHandler()} text="Search" />
            </div>
          </div>

          {/* User data */}
          {userEmail !== "" &&
            (console.log(userData),
            (
              <div className="container">
                <h2 className="row d-flex justify-content-center">{userEmail} Data:</h2>
                {userData?.urls?.length !== 0 && (
                  <div className="row d-flex justify-content-center mt-3">
                    <div className="w-75 mb-3">
                      <h3>URLs</h3>
                      <ul className="list-group">
                        {userData?.urls?.map((url) => (
                          <li onClick={() => urlInfoHandler(url)} className="list-group-item" key={url._id}>
                            {url.addr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {userData?.files?.length !== 0 && (
                  <div className="row d-flex justify-content-center mt-3">
                    <div className="w-75 mb-3">
                      <h3>Files</h3>
                      <ul className="list-group">
                        {userData?.files?.map((file) => (
                          <li onClick={() => fileInfoHandler(file)} className="list-group-item" key={file._id}>
                            {file.fileName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          {userData?.urls?.length === 0 && userData?.files?.length === 0 && (
            <p className="h-4 row d-flex justify-content-center text-danger">
              No Data for this user
            </p>
          )}
        </>
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

function verifyEmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
