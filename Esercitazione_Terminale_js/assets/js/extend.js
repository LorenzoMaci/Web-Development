document.addEventListener("DOMContentLoaded", function() {
    const terminal = document.getElementById('terminale');
    const terminal_output = document.querySelector("#terminale_output");
    const exitButton = document.getElementById('exit');
    const ingrandisciButton = document.getElementById('ingrandisci');
    const abbassaButton = document.getElementById('abbassa');

    //nuovo terminale
    const creazione_terminale = document.createElement('div');
    creazione_terminale.id = 'creazione_terminale';

    function printOutput(container, text) {
        const output = document.createElement('div');
        output.textContent = text;
        output.style.wordBreak = 'break-word'; //garantisce che il testo si avvolga all'interno del contenitore
        container.appendChild(output); 
        terminal_output.scrollTop = terminal_output.scrollHeight; //così l'output sarà sempre visibile infatti scorre l'ouput alla fine
    }
    

    function displayMedia(container, url) {
        let mediaElement;
        if (url.includes('youtube.com/watch')) {
//divido l'array in sottostringhe tramite split e mettiamo v= perchè i link di youtube hanno https://www.youtube.com/watch?v=Ndk2WQDRm7A e 
// viene diviso in due parti, prendo la prima parte [1] che contiene l'ID del video dividiamo questa stringa usando '&' come delimitatore 
//per separare l'ID del video dagli altri parametri e prendo la parte iniziale quindi [0]  
            const videoId = url.split('v=')[1].split('&')[0];
            mediaElement = document.createElement('iframe'); //iframe è un elemento html che serve a mostare il contenuto della pagina web
            mediaElement.src = 'https://www.youtube.com/embed/' + videoId; 
            mediaElement.style.width = '100%';
            mediaElement.style.height = '500px';
            mediaElement.allowFullscreen = true;
        } else {
            mediaElement = document.createElement('iframe');
            mediaElement.src = url;
            mediaElement.style.width = '100%';
            mediaElement.style.height = '500px';
        }
        container.appendChild(mediaElement);
        terminal_output.scrollTop = terminal_output.scrollHeight;
    }

    const apiKey = 'e40155c534b755e613ad167ada67ce0c';

    async function getWeather(apiKey, cityName, container) {
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey + '&units=metric';
        try {
            const response = await fetch(url); //attendo la promise
            if (!response.ok) {
                throw new Error(" Errore nella richiesta");
            }
            const data = await response.json(); //se la richiesta ha successo converto la risposta in JSON
            printWeatherInfo(data, container);
        } catch (error) { 
            printOutput(container, "Errore: " + error); 
        }
    }

    function printWeatherInfo(data, container) {
        const location = data.name;
        const country = data.sys.country;
        const temperature = data.main.temp;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        printOutput(container, "Location: " + location + ", " + country);
        printOutput(container, "Temperatura: " + temperature + "°C");
        printOutput(container, "Velocità Vento: " + windSpeed + " m/s");
        printOutput(container, "Umidità: " + humidity + "%");
    }

    function printDate(container) {
        printOutput(container, new Date().toString());
    }

    function clearOutput() {       
        terminal_output.innerHTML = '';
    }

    function displayHelp(container) {
        printOutput(container, "date -> Stampa Data e orario");
        printOutput(container, "clear -> Rimuove tutte le righe di comando");
        printOutput(container, "meteo -> Visualizza i Dati dell'API inserita scrivendo la città");
        printOutput(container, "surriscaldamento -> Visualizza contenuti multimediali dal link fornito");
        printOutput(container, "help -> Ti fa visualizzare i comandi qui presenti");
    }

    function executeCommand(command, outputContainer) {
        const args = command.trim().split(' '); //trim() rimuove gli spazzi
        const cmd = args[0];
        const rest = args.slice(1).join(' '); //prende gli elementi a partire dall'indice uno e li unisce in una stringa tramite join()

        switch (cmd) {
            case 'date':
                printDate(outputContainer);
                break;
            case 'clear':
                clearOutput();
                break;
            case 'meteo':
                if (rest) {
                    getWeather(apiKey, rest, outputContainer);
                } else {
                    printOutput(outputContainer, "Usa: meteo <Nome citta>");
                }
                break;
            case 'surriscaldamento':
                if (rest) {
                    displayMedia(outputContainer, rest);
                } else {
                    printOutput(outputContainer, 'Usa: surriscaldamento <url>');
                }
                break;
            case 'help':
                displayHelp(outputContainer);
                break;
            default:
                printOutput(outputContainer, 'Command not found: ' + command);
                break;
        }
    }


    exitButton.addEventListener('click', function() {
//qui il terminale viene sostituito con l'elemento creazione_terminale che memorizza la dimensione e la posizione del terminale
        terminal.parentNode.insertBefore(creazione_terminale, terminal);
        terminal.remove(); 
    });

    ingrandisciButton.addEventListener('click', function() {
        terminal.style.width = '100%';
        terminal.style.height = '100%';
    });

    abbassaButton.addEventListener('click', function() {
        terminal.style.width = '50%';
        terminal.style.height = '50%';
    });

    const restoreButton = document.getElementById('restore');

    restoreButton.addEventListener('click', function() {
        if (document.getElementById('creazione_terminale')) { //controllo se esiste l'elemento per la creazione del temrinale
            clearOutput(); 
            createPrompt(); 
            creazione_terminale.parentNode.insertBefore(terminal, creazione_terminale); //ripristino il terminale nella posizione originale
            creazione_terminale.remove(); 
        }
    });


    function createPrompt() {
        const promptDiv = document.createElement('div');
        promptDiv.classList.add('prompt');

        const terminaleOutputDiv = document.createElement('div');
        terminaleOutputDiv.id = 'terminale_output';

        const promptInnerDiv = document.createElement('div');
        promptInnerDiv.id = 'prompt';
        const userSpan = document.createElement('span');
        userSpan.classList.add('user');
        userSpan.textContent = 'lexor02@ubuntu:~$';
        const inputTextarea = document.createElement('textarea');
        inputTextarea.classList.add('input');

        const outputDiv = document.createElement('div');
        outputDiv.id = 'output';

        promptInnerDiv.appendChild(userSpan);
        promptInnerDiv.appendChild(inputTextarea);

        terminaleOutputDiv.appendChild(promptInnerDiv);
        terminaleOutputDiv.appendChild(outputDiv);

        promptDiv.appendChild(terminaleOutputDiv);

        terminal_output.appendChild(promptDiv);

        //Applico le carattersitche css nella inputTextarea
        inputTextarea.style.background = 'none';
        inputTextarea.style.border = 'none';
        inputTextarea.style.outline = 'none';
        inputTextarea.style.color = 'white';
        inputTextarea.style.fontWeight = '500';
        inputTextarea.style.width = '100%';
        inputTextarea.style.resize = 'none';
        inputTextarea.style.overflowY = 'hidden';
        inputTextarea.style.marginLeft = '8px';
        inputTextarea.style.fontSize = '16px';
        inputTextarea.style.lineHeight = '1.2';
        inputTextarea.style.height = '0';

        // Applico le carattersitche css nell'output
        outputDiv.style.padding = '10px';
        outputDiv.style.whiteSpace = 'pre-wrap';
        outputDiv.style.overflowY = 'auto';
        outputDiv.style.flexGrow = '1';

        // Applico le carattersitche css nel prompt
        promptInnerDiv.style.background = 'rgba(95,158,160,0.5)';
        promptInnerDiv.style.padding = '2px 10px';
        promptInnerDiv.style.fontWeight = '500';
        promptInnerDiv.style.display = 'flex';
        promptInnerDiv.style.alignItems = 'center';

        promptDiv.classList.add('hidden');

        const newInput = inputTextarea;
        const outputContainer = outputDiv;
        newInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const command = newInput.value.trim();
                if (command) { //controllo se non è una stringa vuota
                    printOutput(outputContainer, 'lexor02@ubuntu:~$ ' + command);
                    executeCommand(command, outputContainer);
                    newInput.disabled = true;
                    promptDiv.classList.remove('hidden');
                    createPrompt();
                }
            }
        });
        newInput.addEventListener('input', function() {
            newInput.style.height = '0';
            newInput.style.height = (inputTextarea.scrollHeight)  + 'px';
        });
        newInput.focus();
    }

    createPrompt(); // Crea il primo input 
});
