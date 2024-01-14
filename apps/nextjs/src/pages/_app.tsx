import "../styles/globals.css";

import type { AppType } from "next/app";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Wrapper } from "components/Wrapper";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { theme } from "~/utils/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </SessionProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default api.withTRPC(MyApp);
