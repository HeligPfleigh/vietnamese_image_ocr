import React, { useCallback, useState, useEffect } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import UploadProgress from "./UploadProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  header: {
    fontWeight: 900,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface IUpload {
  onRecognizedText: (text: string) => void;
  onRecognizing: (reg: boolean) => void;
  imgurClientID: string;
}

export default function Upload({
  onRecognizedText,
  onRecognizing,
  imgurClientID,
}: IUpload) {
  const classes = useStyles();
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>(-1);
  const source = axios.CancelToken.source();

  const onDrop = useCallback((acceptedFiles) => {
    const [first] = acceptedFiles;
    setFile(first);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".png", ".jpg", ".jpeg", ".tif"],
    multiple: false,
    disabled: progress >= 0 && progress < 100,
  });

  const onCancelUploading = () => {
    setProgress(-1);
    setFile(undefined);
    source.cancel();
  };

  useEffect(() => {
    if (file) {
      const upload = async () => {
        try {
          onRecognizedText("");
          onRecognizing(true);
          const formData = new FormData();
          formData.append("image", file);
          console.log(imgurClientID);
          const {
            data: {
              data: { link },
            },
          } = await axios.post("https://api.imgur.com/3/image", formData, {
            headers: {
              Authorization: `Client-ID ${imgurClientID}`,
            },
            cancelToken: source.token,
            onUploadProgress: function (progressEvent) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            },
          });
          console.log({ link });
          const { data } = await axios.post("/api/ocr", { image: link });
          onRecognizedText(data?.message || "");
        } catch (err) {
          console.log(err);
        } finally {
          onRecognizing(false);
        }
      };
      upload();
    }
  }, [file]);

  return (
    <Box className={classes.root}>
      <Typography className={classes.header}>File Upload</Typography>
      <Box
        minHeight={200}
        minWidth={300}
        className={classes.uploadBox}
        marginTop={2}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </Box>
      {file && (
        <>
          <UploadProgress
            name={file.name}
            percentage={progress}
            onCancelUploading={onCancelUploading}
          />
          <img
            src={URL.createObjectURL(file)}
            style={{ width: 100, height: 100 }}
          />
        </>
      )}
    </Box>
  );
}
