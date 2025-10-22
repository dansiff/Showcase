"use client";
import { useEffect } from "react";
import { HeaderConfig, useHeader } from "./LayoutContext";

type Props = Partial<HeaderConfig>;

export default function HeaderSettings(props: Props) {
  const { setConfig } = useHeader();
  useEffect(() => {
    setConfig(props);
    // We intentionally only run this when props change
  }, [JSON.stringify(props)]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
