import React, { useCallback, useEffect, useState } from "react";
// import receptUpload from "../../assets/receptUpload.svg";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { uploadPost } from "./../../utils/apiHelper";

const DocDropzone = ({ fileItem, setFile }) => {
  console.log(fileItem);
  let [fileUrl, setFileUrl] = useState(fileItem);
  let [loading, setLoading] = useState(false);
  let [acceptedFile, setAcceptedFile] = useState("");
  let [uploadProgress, setUploadProgress] = useState(0);
  function ellipsePdfName(pdfName = "", width = 8) {
    if (!pdfName) {
      return "";
    }
    if (pdfName.length > 24) {
      return `${pdfName.slice(0, width)}...${pdfName.slice(-width)}`;
    } else {
      return pdfName;
    }
  }

  console.log(fileItem);
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 1) {
      toast.error("Please select only 1 document");
      return;
    }


    if (
      acceptedFiles[0].type.match(/image\/.*/)
    ) {
      let file = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      uploadToCloud(file[0]);
    } else {
      toast.error("Select only images or pdf files.");
      return
    }

    // if (acceptedFile[0].type.match(/application\/pdf/)) {
    //   let file = acceptedFiles.map((file) =>
    //     Object.assign(file, {
    //       preview: URL.createObjectURL(file),
    //     })
    //   );
    //   console.log("jkgsnsg");

    //   uploadToCloud(file[0]);
  }, []);

  const removeFile = (file) => {
    setFileUrl("");
    setFile("");
    setUploadProgress(0);
    setAcceptedFile("");
  };

  const { getRootProps, getInputProps, isDragReject, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: "image/*",
    });


  const getUploadKeyWithBaseFolderLocation = (filename) => {
    return new Date().getTime() + `_${filename}`;
  };

  const uploadToCloud = async (file) => {
    if (loading) return;

    try {
      const key = getUploadKeyWithBaseFolderLocation(file.name);
      const extension = file.name.split(".")[file.name.split(".").length - 1];
      setLoading(true);
      const payload = {
        key: key,
        content: file.type,
      };
      const response = await uploadPost(payload);
      if (!response) return;
      var url = response;

      const handleProgress = (evt) => {
        let p = `${evt.type}: ${evt.loaded} bytes transferred\n`;
        var progress = Math.ceil((evt.loaded / evt.total) * 100);
        setUploadProgress(progress);
      };

      setLoading(true);

      setUploadProgress(0);

      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("x-amz-acl", "public-read");
      xhr.setRequestHeader("Caches", false);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.addEventListener("progress", handleProgress, false);
      xhr.onload = function () {
        setLoading(false);
        if (xhr.readyState == 4 && xhr.status == "200") {
          let file_Url = url.split("?")[0];
          setFileUrl(file_Url);
          setFile(file_Url);
          setAcceptedFile(file);
        } else {
          console.log(
            "Could not upload image please try again---",
            "asset image"
          );
        }
      };
      xhr.onerror = function (error) {
        setLoading(false);
        console.log("Could not upload image please try again", "asset image");
      };
      xhr.send(file);
    } catch (error) {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (!fileItem) {
      removeFile();
    } else {
      if (fileItem.includes('http')) {
        setFileUrl(fileItem)
      } else {
        setFileUrl(fileItem)
      }
    }
  }, [fileItem]);
  console.log(fileUrl);
  return (
    <div className="">
      {fileUrl == "" && uploadProgress == 0 ? (
        <div
          {...getRootProps()}
          style={{cursor:"pointer"}}
        >

          <input {...getInputProps()} />
          <div >
            <div >
              <div >
                <img
                  alt=""
                />
              </div>
            </div>
            <div className=" " style={{textAlign:'center',marginTop:"-10px"}}>
              Click to upload images
            </div>
          </div>
        </div>
      ) : fileUrl == "" && uploadProgress != 0 ? (
        <div className="h-[70%]">
          <p>Uploading... {uploadProgress}%</p>
        </div>
      ) : fileUrl != "" && uploadProgress != 0 && uploadProgress != 100 ? (
        <div className="h-[70%]">
          <p>Uploading... {uploadProgress}%</p>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="cursor-pointer flex w-full justify-center items-center"
        >

          <input {...getInputProps()} />
          <div style={{position:'relative'}} >
            <img  src={fileUrl} style={{ height: "100%", width: "100%" }} />
            <div style={{position:'absolute',top:'0',right:"0" , padding:"0" , margin:"-12px -20px 0 0 ",cursor:'pointer'}}>
            <svg
              onClick={() => {
                removeFile(fileUrl);
              }}
              
              width="20"
              height="20"
              viewBox="5 8 34 34"
              fill="top"
            >
              <path
                d="M8.49984 11.3335C8.12412 10.9578 7.91304 10.4482 7.91304 9.91682C7.91304 9.38547 8.12412 8.87588 8.49984 8.50016C8.87556 8.12444 9.38515 7.91336 9.9165 7.91336C10.4479 7.91336 10.9574 8.12444 11.3332 8.50016L25.4998 22.6668C25.8755 23.0425 26.0866 23.5521 26.0866 24.0834C26.0866 24.6148 25.8755 25.1244 25.4998 25.5001C25.1241 25.8758 24.6145 26.0869 24.0831 26.0869C23.5518 26.0869 23.0422 25.8758 22.6665 25.5001L8.49984 11.3335Z"
                fill="black"
              />
              <path
                d="M22.6668 8.50016C23.0426 8.12444 23.5521 7.91336 24.0835 7.91336C24.6148 7.91336 25.1244 8.12444 25.5002 8.50016C25.8759 8.87588 26.087 9.38547 26.087 9.91682C26.087 10.4482 25.8759 10.9578 25.5002 11.3335L11.3335 25.5001C10.9578 25.8758 10.4482 26.0869 9.91689 26.0869C9.38554 26.0869 8.87595 25.8758 8.50022 25.5001C8.1245 25.1244 7.91343 24.6148 7.91342 24.0834C7.91342 23.5521 8.1245 23.0425 8.50022 22.6668L22.6668 8.50016Z"
                fill="black"
              />
            </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocDropzone;
