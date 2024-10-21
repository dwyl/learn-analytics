"use client";

import React from "react";
import { ReactNode } from "react";
import ScrollDepthTracker from "./depth-tracker";

interface ClientApplicationProps {
  children: ReactNode;
}

const ClientApplication = ({ children }: ClientApplicationProps) => {
  return (
    <>
      <ScrollDepthTracker />
      {children}
    </>
  );
};

export default ClientApplication;