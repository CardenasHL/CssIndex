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
    parent.postMessage("TEST info","*");
    parent.postMessage(jsonData,"*");
    //parent.document.dispatchEvent(new CustomEvent('UnityData', { detail: jsonData }));
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
    callSetVolumeBackground();
    callSetVolumeSFX();
    
} else {
    // La variable no existe o es falsa
    console.error("Unity aún no está listo. Esperando a que esté listo...");

    // Verificar si la variable existe
    if (typeof sceneLoaded !== 'undefined') {
        // La variable existe pero es falsa, agregar a unityReadyCallbacks
        unityReadyCallbacks.push(callSendEmailToUnity);
        unityReadyCallbacks.push(callSendIDToUnity);
        unityReadyCallbacks.push(callSetVolumeBackground);
        unityReadyCallbacks.push(callSetVolumeSFX);
    } else {
        // La variable no existe, imprime un mensaje en la consola
        console.error("La variable sceneLoaded no está definida.");
    }
}
//Funciones de audio
function callSetVolumeBackground(){
    setVolumeBackground(0);
    console.log("Llama a la función de setVolumeBackground");
}
function callSetVolumeSFX(){
    setVolumeSFX(-12);
}


function ToggleMute() {
            unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMute');
        }
function ToggleMuteBackground() {
            unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMuteBackground');
        }   
function ToggleMuteSFX() {
            unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMuteSFX');
        }     
function updateVolume(volume) {
      unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolume', volume);
        }
function setVolumeBackground(volume) {
      
    if (sceneLoaded) {
        unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeBackground', volume);
    } 
    else {
        console.error("La instancia de Unity no está disponible.");
        unityReadyCallbacks.push(() => setVolumeBackground(volume));
    }
        }
function setVolumeSFX(volume) {
      unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeSFX', volume);
        }


