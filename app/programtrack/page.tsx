import type { Metadata } from "next";
import ProgramTrackApp from "./programtrack-app";

export const metadata: Metadata = {
  title: "ProgramTrack | 21st CCLC Program Data Demo",
  description: "Explore a sample 21st Century Community Learning Centers program data and reporting system.",
};

export default function ProgramTrackPage() {
  return <ProgramTrackApp />;
}
