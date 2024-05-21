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

    window.unityDataReceived = function(jsonData) {
        console.log("Información recibida", jsonData);
        window.dispatchEvent(new CustomEvent('UnityData', { detail: jsonData }));
        parent.postMessage("TEST info", "*");
        parent.postMessage(jsonData, "*");
    };

    // Llamada de funciones al detectar escena cargada
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

    function updateVolume(volume) {
        unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolume', volume);
    }

    // Crear contenedor de botones
    var buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    document.body.appendChild(buttonContainer);

    // Botón para toggle mute general
    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = 'Toggle Mute All';
    toggleButton.style.backgroundColor = '#4CAF50'; // Color verde
    toggleButton.style.color = 'white';
    toggleButton.style.border = '1 px solid #000';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.marginRight = '10px';
    toggleButton.style.cursor = 'pointer';
    buttonContainer.appendChild(toggleButton);

    // Estado inicial del botón (no muteado)
    var isMuted = false;

    // Añadir un evento al botón toggle
    toggleButton.addEventListener('click', function() {
        isMuted = !isMuted; // Alternar el estado muteado

        if (isMuted) {
            toggleButton.style.backgroundColor = '#f44336'; // Color rojo
            ToggleMute();
        } else {
            toggleButton.style.backgroundColor = '#4CAF50'; // Color verde
            ToggleMute();
        }
    });

    // Botón para toggle mute background
    var toggleButtonBackground = document.createElement('button');
    toggleButtonBackground.innerHTML = 'Toggle Mute Background';
    toggleButtonBackground.style.backgroundColor = '#4CAF50'; // Color verde
    toggleButtonBackground.style.color = 'white';
    toggleButtonBackground.style.border = '1 px solid #000';
    toggleButtonBackground.style.padding = '10px 20px';
    toggleButtonBackground.style.cursor = 'pointer';
    toggleButtonBackground.style.marginRight = '10px';
    buttonContainer.appendChild(toggleButtonBackground);

    // Estado inicial del botón (no muteado)
    var isMutedBackground = false;

    // Añadir un evento al botón toggle background
    toggleButtonBackground.addEventListener('click', function() {
        isMutedBackground = !isMutedBackground; // Alternar el estado muteado

        if (isMutedBackground) {
            toggleButtonBackground.style.backgroundColor = '#f44336'; // Color rojo
            ToggleMuteBackground();
        } else {
            toggleButtonBackground.style.backgroundColor = '#4CAF50'; // Color verde
            ToggleMuteBackground();
        }
    });

    // Botón para toggle mute SFX
    var toggleButtonSFX = document.createElement('button');
    toggleButtonSFX.innerHTML = 'Toggle Mute SFX';
    toggleButtonSFX.style.backgroundColor = '#4CAF50'; // Color verde
    toggleButtonSFX.style.color = 'white';
    toggleButtonSFX.style.border = '1 px solid #000';
    toggleButtonSFX.style.padding = '10px 20px';
    toggleButtonSFX.style.marginRight = '10px';
    toggleButtonSFX.style.cursor = 'pointer';
    buttonContainer.appendChild(toggleButtonSFX);

    // Estado inicial del botón (no muteado)
    var isMutedSFX = false;

    // Añadir un evento al botón toggle SFX
    toggleButtonSFX.addEventListener('click', function() {
        isMutedSFX = !isMutedSFX; // Alternar el estado muteado

        if (isMutedSFX) {
            toggleButtonSFX.style.backgroundColor = '#f44336'; // Color rojo
            ToggleMuteSFX();
        } else {
            toggleButtonSFX.style.backgroundColor = '#4CAF50'; // Color verde
            ToggleMuteSFX();
        }
    });

});
