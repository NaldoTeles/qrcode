function generateQRCode() {
    var url = document.getElementById("url").value;  // Pega o valor da URL inserida
    var qrcodeContainer = document.getElementById("qrcode");

    // Limpa qualquer QR Code anterior
    qrcodeContainer.innerHTML = "";

    // Gera um novo QR Code
    if (url.trim() !== "") {
        new QRCode(qrcodeContainer, {
            text: url,
            width: 300,
            height: 300
        });
    } else {
        alert("Por favor, insira uma URL válida.");
    }
}
