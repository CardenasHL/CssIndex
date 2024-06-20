document.addEventListener('DOMContentLoaded', function() {
    var sceneLoaded = false;
    var unityReadyCallbacks = [];
    var volumeBackground = '-24';
    var volumeSFX = '-12';

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
    //Función que recibe el json desde unity
    window.unityDataReceived = function(jsonData) {
        console.log("Json recibido", jsonData);
        window.dispatchEvent(new CustomEvent('UnityData', { detail: jsonData }));
        parent.postMessage("TEST info", "*");
        parent.postMessage(jsonData, "*");
    };
    // FUNCIONES DE AUDIO
    function callSetVolumeBackground() {
        setVolumeBackground(volumeBackground);
    }
    //Ajustar el volumen de la música de fondo.
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
    //Ajustar el volumen de la música de fondo
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
    //De estas funciones en principio vamos a usar solo ToggleMute, sería interesante conservar todas por si cambiamos de opinión en el futuro.
    function ToggleMute() {
        unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMute');
    }

    function ToggleMuteBackground() {
        unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMuteBackground');
    }

    function ToggleMuteSFX() {
        unityInstance.SendMessage('MusicControllerWebAPI', 'ToggleMuteSFX');
    }
});
