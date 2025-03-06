document.addEventListener("DOMContentLoaded", function () {
    // Generate the QR code with the correct path
    let qrCode = new QRCode(document.getElementById("qrcode"), {
        text: window.location.origin + "/project-M/templates.html", // Ensure correct path
        width: 200,
        height: 200
    });

    // Make the QR code clickable
    document.getElementById("qrcode").addEventListener("click", function () {
        window.location.href = "/project-M/templates.html"; // Ensure correct path
    });
});
