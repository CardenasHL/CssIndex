var sceneLoaded = false;
var unityReadyCallbacks = [];

window.unitySceneLoaded = function() {
    console.log("La escena de Unity está cargada y lista.");
    sceneLoaded = true;
    unityReadyCallbacks.forEach(callback => callback());
    unityReadyCallbacks = [];
};
window.unityDataReceived = function(jsonData) {
    console.log("Información recibida",jsonData);
    window.dispatchEvent(new CustomEvent('UnityData', { detail: jsonData }));
    parent.dispatchEvent(new CustomEvent('UnityData', { detail: jsonData }));
};

// Pasar los datos del email
function callSendEmailToUnity() {
    var email = "usuario@example.com";
    sendEmailToUnity(email);
}
function callSendIDToUnity() {
    var userID = "5"
    sendIDToUnity(userID);
}
function sendIDToUnity(userID){
    if (sceneLoaded) {
        unityInstance.SendMessage('DataReceiver', 'ReceiveUserID', userID);
    } 
    else {
        console.error("La instancia de Unity no está disponible.");
        unityReadyCallbacks.push(() => sendIDToUnity(email));
    }
}

function sendEmailToUnity(email) {
    if (sceneLoaded) {
        unityInstance.SendMessage('DataReceiver', 'ReceiveEmail', email);
    } 
    else {
        console.error("La instancia de Unity no está disponible.");
        unityReadyCallbacks.push(() => sendEmailToUnity(email));
    }
}

// Verificar si la escena está cargada y lista
if (typeof sceneLoaded !== 'undefined' && sceneLoaded) {
    // La variable existe y es verdadera
    callSendEmailToUnity();
    callSendIDToUnity();
} else {
    // La variable no existe o es falsa
    console.error("Unity aún no está listo. Esperando a que esté listo...");

    // Verificar si la variable existe
    if (typeof sceneLoaded !== 'undefined') {
        // La variable existe pero es falsa, agregar a unityReadyCallbacks
        unityReadyCallbacks.push(callSendEmailToUnity);
        unityReadyCallbacks.push(callSendIDToUnity);
    } else {
        // La variable no existe, imprime un mensaje en la consola
        console.error("La variable sceneLoaded no está definida.");
    }
}

