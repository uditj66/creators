import React, { ReactNode } from "react";

const Authlayout = ({ children }: { children: ReactNode }) => {
  return <main className="flex justify-center pt-48">{children}</main>;
};

export default Authlayout;
