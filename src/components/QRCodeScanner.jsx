import { useEffect, useRef } from "react";
import jsQR from "jsqr";

function QRCodeScanner({ onScan }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // iOS Safari requirement
                await video.play();
                requestAnimationFrame(tick);
            } catch (err) {
                console.error("❌ Camera error:", err);
            }
        }

        function drawLine(begin, end, color) {
            context.beginPath();
            context.moveTo(begin.x, begin.y);
            context.lineTo(end.x, end.y);
            context.lineWidth = 4;
            context.strokeStyle = color;
            context.stroke();
        }

        function tick() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // ✅ Draw box around detected QR
                    drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                    drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                    drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                    drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                    console.log("✅ QR Code detected:", code.data);
                    onScan(code.data); // Call parent only when valid QR found
                }
            }
            animationRef.current = requestAnimationFrame(tick);
        }

        startCamera();

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (video.srcObject) {
                video.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onScan]);

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} className="hidden" />
            <canvas ref={canvasRef} className="w-80 h-80 border rounded shadow" />
        </div>
    );
}

export default QRCodeScanner;
