"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./back-button.scss";

const BackButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <button className="back-button" onClick={() => router.back()}>
      {children}
    </button>
  );
};

export default BackButton;
