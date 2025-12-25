import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo-orbit.svg";

type LogoProps = {
  showWordmark?: boolean;
};

export default function Logo({ showWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2 rounded-lg px-1 py-0.5 transition-transform hover:scale-105"
      aria-label="The Fusion Space Inc"
    >
      <Image src={logo} alt="The Fusion Space Inc" width={36} height={36} />
      {showWordmark && (
        <span className="bg-gradient-to-r from-sky-300 via-indigo-200 to-fuchsia-200 bg-clip-text text-sm font-semibold tracking-tight text-transparent">
          Fusion Space
        </span>
      )}
    </Link>
  );
}
