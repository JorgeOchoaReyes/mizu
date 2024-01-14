import React from "react";

import { Navbar } from "../Navbar";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <Navbar title="" />
      <div className="bg-info-content">{children}</div>
    </>
  );
};

export { Wrapper };
