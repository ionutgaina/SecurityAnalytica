import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { hasToken } from "../../common/api/auth";
import CustomButton from "../../common/components/CustomButton/CustomButton";
import Page from "../../common/components/Page/Page";
import "./Home.css";

export default function Home() {
  const [file, setFile] = useState<any>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };

  const [optionSelect, setOptionSelect] = useState<"file" | "url">("file");


  function buttonHandler(type: string) {
    if (type == "analyze") {
      analyzeHandler();
    } else if (type == "add") {
      addHandler();
    }
  }


  function analyzeHandler() {
    if (optionSelect == "file") {
      console.log("analyze file");
    }
    if (optionSelect == "url") {
      console.log("analyze url");
    }
  }

  function addHandler() {
    if (optionSelect == "file") {
      console.log("add file");
    }
    if (optionSelect == "url") {
      console.log("add url");
    }

  }

  return (
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
        <form>
          {/* Url option */}
          {optionSelect == "url" && (
            <div className="row d-flex justify-content-center mt-3">
              <div className="w-75 mb-3">
                <input type="text" className="form-control" placeholder="write your url here" />
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
        </form>
      </div>
    </Page>
  );
}
