// Definir la función para llamar a sendEmailToUnity
function callSendEmailToUnity() {
    var email = "usuario@example.com";
    sendEmailToUnity(email);
}

// Llama a sendEmailToUnity desde el script externo
if (sceneLoaded) {
    callSendEmailToUnity();
} else {
    // Si Unity aún no está listo, espera a que lo esté
    unityReadyCallbacks.push(callSendEmailToUnity);
}
