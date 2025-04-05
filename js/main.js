document.addEventListener('DOMContentLoaded', function() {
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "https://wa.me/c/+918956761543",
        width: 256,
        height: 256,
        colorDark : "#2c3e50",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});
