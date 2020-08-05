import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";

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
}

export default function Upload({ onRecognizedText, onRecognizing }: IUpload) {
  const classes = useStyles();
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>(-1);

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
    setFile(undefined);
  };

  const worker = useMemo(
    () =>
      createWorker({
        logger: (m) => {
          if (m?.status === "recognizing text")
            setProgress(Math.round(m.progress * 100));
        },
      }),
    []
  );

  useEffect(() => {
    if (file) {
      const upload = async () => {
        try {
          onRecognizedText("");
          onRecognizing(true);
          await worker.load();
          await worker.loadLanguage("vie");
          await worker.loadLanguage("en");
          await worker.initialize("vie");
          const {
            data: { text },
          } = await worker.recognize(file);
          onRecognizedText(text);
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
