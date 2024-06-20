window.unityDataReceived = function(jsonData) {
    console.log("Información recibida", jsonData);
    parent.postMessage(jsonData, "*");
};

const LIMIT_SIZE = 1024;
let sceneLoaded = false;
let unityReadyCallbacks = [];
let volumeBackground = '-24';
let volumeSFX = '-12';

document.addEventListener('DOMContentLoaded', function () {
    if (navigator.appVersion.indexOf("Mac") !== -1 && window.screen.width < LIMIT_SIZE) {
        document.querySelector('.fullscreen').style.display = "none";
    }

    window.unitySceneLoaded = function() {
        sceneLoaded = true;
        unityReadyCallbacks.forEach(callback => callback());
        unityReadyCallbacks = [];
    };

    // Llamar a funciones cuando se detecta la escena cargada, ajuste de los volumenes background y sfx
    if (typeof sceneLoaded !== 'undefined' && sceneLoaded) {
        callSetVolumeBackground();
        callSetVolumeSFX();
    } else {
        console.warn("Unity aún no está listo. Esperando a que esté listo...");
        if (typeof sceneLoaded !== 'undefined') {
            unityReadyCallbacks.push(callSetVolumeBackground);
            unityReadyCallbacks.push(callSetVolumeSFX);
        } else {
            console.error("La variable sceneLoaded no está definida.");
        }
    }
});

function full_screen() {
    if (window.screen.width < LIMIT_SIZE) {
        let player = document.getElementById('webgl-content');
        if (player.requestFullscreen) {
            document.getElementById('webgl-content').requestFullscreen();
        } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen(); // Firefox
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen(); // Chrome and Safari
        }

        screen.orientation.lock("landscape")
        .then(function() {})
        .catch(function(error) {});
    } else {
        console.log("ordenadores");
        //unityInstance.SetFullscreen(1)
        document.getElementById('webgl-content').requestFullscreen();
    }
}

// FUNCIONES DE AUDIO
function callSetVolumeBackground() {
    setVolumeBackground(volumeBackground);
}

function setVolumeBackground(volume) {
    if (sceneLoaded) {
        try {
            unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeBackground', volume);
        } catch (error) {
            console.log("No tiene asignado nuevo sistema MusicController");
        }
    } else {
        console.error("La instancia de Unity no está disponible.");
        unityReadyCallbacks.push(() => setVolumeBackground(volume));
    }
}

function callSetVolumeSFX() {
    setVolumeSFX(volumeSFX);
}

function setVolumeSFX(volume) {
    if (sceneLoaded) {
        try {
            unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeSFX', volume);
        } catch (error) {
            console.log("No tiene asignado nuevo sistema MusicController");
        }
    } else {
        console.error("La instancia de Unity no está disponible.");
        unityReadyCallbacks.push(() => setVolumeSFX(volume));
    }
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
