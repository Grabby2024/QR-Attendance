import { QRCodeSVG } from "qrcode.react";

function QRCodeGenerator({ value }) {
    if (!value) return null;

    return (
        <div className="p-4 border rounded shadow-md">
            <QRCodeSVG value={value} size={200} />
        </div>
    );
}

export default QRCodeGenerator;
