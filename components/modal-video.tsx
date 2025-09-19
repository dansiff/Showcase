"use client";

import { useState, useRef } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import SecondaryIllustration from "@/public/images/secondary-illustration.svg";

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
  videoType: "youtube" | "html";
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoWidth,
  videoHeight,
  videoType,
}: ModalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative">
      {/* Background Illustration */}
      <div
        className="pointer-events-none absolute bottom-8 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      >
        <Image
          className="md:max-w-none"
          src={SecondaryIllustration}
          width={1165}
          height={1012}
          alt="Secondary illustration"
        />
      </div>

      {/* Video Thumbnail Button */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="group relative flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring focus-visible:ring-indigo-200"
            aria-label="Watch the video"
            data-aos="fade-up"
            data-aos-delay={200}
          >
            <figure className="relative overflow-hidden rounded-2xl before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500/20 before:to-gray-900">
              <Image
                className="opacity-50 grayscale"
                src={thumb}
                width={thumbWidth}
                height={thumbHeight}
                priority
                alt={thumbAlt}
              />
            </figure>
            {/* Play icon */}
            <span className="pointer-events-none absolute p-2.5 before:absolute before:inset-0 before:rounded-full before:bg-gray-950 before:duration-300 group-hover:before:scale-110">
              <span className="relative flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  fill="none"
                >
                  <path
                    fill="url(#pla)"
                    fillRule="evenodd"
                    d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm3.5-10-5-3.5v7l5-3.5Z"
                    clipRule="evenodd"
                  />
                  <defs>
                    <linearGradient
                      id="pla"
                      x1={10}
                      x2={10}
                      y1={0}
                      y2={20}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#6366F1" />
                      <stop offset={1} stopColor="#6366F1" stopOpacity=".72" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-medium leading-tight text-gray-300">
                  Watch Demo
                  <span className="text-gray-600"> - </span>
                  3:47
                </span>
              </span>
            </span>
          </button>
        </Dialog.Trigger>

        {/* Modal Content */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[99998] bg-black/70 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />

          <Dialog.Content
            className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-6 sm:px-6"
            onOpenAutoFocus={(e) => {
              e.preventDefault(); // stop auto-focusing close button
              if (videoRef.current) videoRef.current.focus();
            }}
          >
            <div className="relative mx-auto w-full max-w-2xl rounded-lg bg-gray-900 p-4 shadow-lg">
              <Dialog.Close asChild>
                <button
                  className="absolute right-2 top-2 text-2xl text-white hover:text-gray-300"
                  aria-label="Close video"
                >
                  &times;
                </button>
              </Dialog.Close>

              {/* Video rendering */}
              {videoType === "youtube" ? (
                <iframe
                  width={videoWidth || 560}
                  height={videoHeight || 315}
                  src={`${video}?autoplay=1`}
                  title="YouTube video player"
                  style={{ border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  ref={videoRef}
                  width={videoWidth || 560}
                  height={videoHeight || 315}
                  controls
                  autoPlay
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
