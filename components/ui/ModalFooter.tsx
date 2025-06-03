import { useState } from "react";
import Modal from "./Modal";
import Logo from "./Logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";
import Link from "next/link";

export default function Footer() {
    // Example: Open modal for cookie policy
    const [modalOpen, setModalOpen] = useState<null | "cookies" | "policy">(null);

    return (
        <footer>
            <div> {/* ...your layout... */} </div>

            {/* Modal Examples */}
            <Modal
                open={modalOpen === "cookies"}
                onClose={() => setModalOpen(null)}
                title="Cookie Policy"
            >
                {/* Your cookie policy content here */}
                <p>This is your cookie policy...</p>
            </Modal>

            <Modal
                open={modalOpen === "policy"}
                onClose={() => setModalOpen(null)}
                title="User Policy"
            >
                {/* Your user policy content here */}
                <p>This is your user policy...</p>
            </Modal>
        </footer>
    );
}
