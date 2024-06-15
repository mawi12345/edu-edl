import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  #root {
    min-height: 100vh;
    min-width: 100vw;
  }

  #root > div {
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
  }
`;
