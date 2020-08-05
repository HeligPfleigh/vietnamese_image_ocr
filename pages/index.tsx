import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

import Layout from "../components/Layout";
import Upload from "../components/Upload";
import Output from "../components/Output";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  fullHeight: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
}));

export default function Index() {
  const classes = useStyles();
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [recognizing, setRecognizing] = useState<boolean>(false);

  return (
    <Layout>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} elevation={3}>
              <Upload
                onRecognizedText={setRecognizedText}
                onRecognizing={setRecognizing}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              className={clsx(classes.paper, classes.fullHeight)}
              elevation={3}
            >
              <Output recognizedText={recognizedText} handling={recognizing} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}
