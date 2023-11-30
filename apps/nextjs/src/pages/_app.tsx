import "../styles/globals.css";

import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { StyledEngineProvider } from "@mui/material/styles";

import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <StyledEngineProvider injectFirst>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StyledEngineProvider>
  );
};

export default api.withTRPC(MyApp);
