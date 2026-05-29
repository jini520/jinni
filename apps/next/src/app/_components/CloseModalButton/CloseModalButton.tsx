"use client";

import { useRouter } from "next/navigation";
import XIcon from "public/icons/x.svg";
import React from "react";

interface Props {
  className?: string;
}

const CloseModalButton = ({ className }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button className={className} onClick={handleClick}>
      <XIcon color="var(--color-text-primary)" width={24} height={24} />
    </button>
  );
};

export default CloseModalButton;
