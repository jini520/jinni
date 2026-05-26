"use client";

import React, { useEffect } from "react";

const ScrollLock = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return null;
};

export default ScrollLock;
