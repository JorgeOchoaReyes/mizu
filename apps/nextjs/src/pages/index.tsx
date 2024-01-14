import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import type { getSpookTypeResult } from "../../types";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const spooks = api.speak.getSpooks.useQuery();

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    setError("");
  };

  return (
    <>
      <Head>
        <title> Speak </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-[80vh] w-full max-w-[80vw] overflow-auto">
        {spooks.isLoading ? (
          <Loading />
        ) : spooks.error ? (
          <Error message={spooks.error.message} />
        ) : spooks.data?.data ? (
          <SpookTable spooks={spooks.data.data} router={router} />
        ) : (
          <Typography>Nothing to see here</Typography>
        )}
      </main>
    </>
  );
};

const SpookTable: React.FC<{
  spooks: getSpookTypeResult;
  router: NextRouter;
}> = ({ spooks, router }) => {
  if (!spooks) return <Error message="No spooks found" />;
  return (
    <>
      <h1 style={{ marginBottom: "1em" }}>Your spooks</h1>
    </>
  );
};

export default Home;
