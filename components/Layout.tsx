import React, { ReactNode } from "react";
import Head from "next/head";
import { makeStyles } from "@material-ui/core";

type Props = {
  children?: ReactNode;
  title?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(4),
    backgroundImage: "linear-gradient(to right, #FFEEEE , #DDEFBB)",
  },
  footer: {
    margin: "auto",
  },
}));

const Layout = ({ children, title = "Vietnamese Image OCR" }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
      <footer className={classes.footer}>
        Made from love with Nextjs and Tesseractjs
      </footer>
    </div>
  );
};

export default Layout;
