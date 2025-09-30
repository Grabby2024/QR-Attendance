import React, { useEffect, useRef } from "react";

/**
 * Modal
 * Props:
 *  - children: modal content
 *  - onClose: function to call when modal should close
 *  - title: optional string shown in header
 *  - closeOnOverlayClick: boolean (default true)
 */
export default function Modal({ children, onClose, title, closeOnOverlayClick = true }) {
    const overlayRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const prevActive = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        // prevent body scroll while modal is open
        document.body.style.overflow = "hidden";

        // focus the container so keyboard events work
        if (containerRef.current) containerRef.current.focus();

        function handleKey(e) {
            if (e.key === "Escape") {
                onClose?.();
            }
            if (e.key === "Tab") {
                // basic focus trap
                const focusable = containerRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) {
                    e.preventDefault();
                    return;
                }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            }
        }

        document.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", handleKey);
            prevActive?.focus?.();
        };
    }, [onClose]);

    function onOverlayMouseDown(e) {
        if (!closeOnOverlayClick) return;
        if (e.target === overlayRef.current) onClose?.();
    }

    return (
        <div
            ref={overlayRef}
            onMouseDown={onOverlayMouseDown}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                tabIndex={-1}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full outline-none"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {title ? (
                        <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={() => onClose?.()}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
