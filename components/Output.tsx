import React from "react";
import {
  Box,
  Typography,
  makeStyles,
  CircularProgress,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  output: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  header: {
    fontWeight: 900,
  },
  result: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface IOutputProps {
  recognizedText: string;
  handling: boolean;
}

export default function Output({ recognizedText, handling }: IOutputProps) {
  const classes = useStyles();
  const preventDefault = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const blob = new Blob([recognizedText], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("download", "result.txt");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.click();
  };
  return (
    <>
      <Box className={classes.output}>
        <Typography className={classes.header}>Output</Typography>
      </Box>
      <Box className={classes.result}>
        {handling ? <CircularProgress /> : recognizedText}
      </Box>
      {recognizedText && (
        <Link href="#" onClick={preventDefault}>
          Download result
        </Link>
      )}
    </>
  );
}
