"use client";

import { useParams } from "react-router-dom";
import { FilesBrowser } from "./FileBrowser";

export const FilesBrowserWrapper = () => {
  const { username } = useParams<{ username: string }>();
  return <FilesBrowser email={username} />;
};