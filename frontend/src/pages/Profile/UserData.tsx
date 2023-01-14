import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserEmail } from "../../common/api/auth";
import { deleteFile, getUserFiles, IFileInfo } from "../../common/api/files";
import { deleteUrl, getUserUrls, IUrlInfo } from "../../common/api/url";
import FileInfoModal from "../../common/components/InfoModals/FileInfoModal";
import UrlInfoModal from "../../common/components/InfoModals/UrlInfoModal";

interface IUserData {
  urls: IUrlInfo[];
  files: IFileInfo[];
}

export function UserData() {
  const [userData, setUserData] = useState<IUserData | null>(null);

  // Modals state
  const [showFileInfoModal, setShowFileInfoModal] = useState<boolean>(false);
  const [FileInfoModalData, setFileInfoModalData] = useState<IFileInfo | null>(null);

  const [showUrlInfoModal, setShowUrlInfoModal] = useState<boolean>(false);
  const [UrlInfoModalData, setUrlInfoModalData] = useState<IUrlInfo | null>(null);
  // End modals state

  const [errorState, setErrorState] = useState<boolean>(false);

  const urlInfoHandler = (urlInfo: IUrlInfo) => {
    setUrlInfoModalData(urlInfo);
    setShowUrlInfoModal(true);
  };

  const fileInfoHandler = (fileInfo: IFileInfo) => {
    setFileInfoModalData(fileInfo);
    setShowFileInfoModal(true);
  };

  const deleteUrlHandler = (urlAddress: string) => {
    console.log(urlAddress);
    setUrlInfoModalData(null);
    setShowUrlInfoModal(false);
    setErrorState(true);
    try {
      //are you sure
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        setUrlInfoModalData(null);
        setShowUrlInfoModal(false);
        if (result.isConfirmed) {
          try {
            await deleteUrl({ userEmail: getUserEmail(), urlAddress });
            Swal.fire("Deleted!", "Your urlhas been deleted.", "success");
            fetchData();
          } catch (error) {
            Swal.fire("Error!", "Something went wrong", "error");
          }
        }
      });
    } catch (error) {
    } finally {
      setErrorState(false);
    }
  };

  const deleteFileHandler = (fileSHA512Digest: string) => {
    console.log(fileSHA512Digest);
    setFileInfoModalData(null);
    setShowFileInfoModal(false);
    setErrorState(true);
    try {
      //are you sure
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        setFileInfoModalData(null);
        setShowFileInfoModal(false);
        if (result.isConfirmed) {
          try {
            await deleteFile({ userEmail: getUserEmail(), fileSHA512Digest });
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            fetchData();
          } catch (error) {
            Swal.fire("Error!", "Something went wrong", "error");
          }
        }
      });
    } catch (error) {
    } finally {
      setErrorState(false);
    }
  };

  const fetchData = () => {
    try {
      let urlsResponse: IUrlInfo[];
      getUserUrls({ userEmail: getUserEmail() }).then((response) => {
        urlsResponse = response.data;

        let filesResponse: IFileInfo[];
        getUserFiles({ userEmail: getUserEmail() }).then((response) => {
          filesResponse = response.data;
          const userDataVar: IUserData = {
            urls: urlsResponse,
            files: filesResponse,
          };
          console.log(userDataVar);
          setUserData(userDataVar);
        });
      });
    } catch (e: any) {
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchData();
    return;
  }, []);

  return (
    <>
      {/* User data */}

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
                <li
                  onClick={() => fileInfoHandler(file)}
                  className="list-group-item"
                  key={file._id}
                >
                  {file.fileName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {userData?.urls?.length === 0 && userData?.files?.length === 0 && (
        <p className="h-4 row d-flex justify-content-center text-danger">You don't have Data</p>
      )}

      {/* Modals */}
      {UrlInfoModalData && (
        <UrlInfoModal
          show={showUrlInfoModal}
          onHide={() => {
            setShowUrlInfoModal(false);
            setUrlInfoModalData(null);
          }}
          urlInfo={UrlInfoModalData}
          deleteAction={deleteUrlHandler}
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
          deleteAction={deleteFileHandler}
        />
      )}
    </>
  );
}
