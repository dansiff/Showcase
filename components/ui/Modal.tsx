import React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
