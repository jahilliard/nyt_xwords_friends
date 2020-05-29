const connectionOptions =  {
         "force new connection" : true,
         "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
         "timeout" : 10000, //before connect_error and connect_timeout are emitted.
         "transports" : ["websocket"]
 };

const curr_ngrok = '6e6e4f9fae6e.ngrok.io'

var userCurrentLocation = ''

const socket = io("wss://" + curr_ngrok, connectionOptions);
// const socket = io('http://localhost:3000');

// Select the node that will be observed for mutations
const targetNodes = document.querySelectorAll('g[data-group="cells"] > g');

// Callback function to execute when mutations are observed
const updateSquare = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    // console.log(mutation)
    console.log(mutationsList)
    for(let mutation of mutationsList) {
        if (mutation.target.parentNode.attributes[0].value !== 'Cell-hidden--3xQI1' ){
            let cellId = mutation.target.parentNode.parentNode.firstChild.attributes[3].value.substring(8);
            let cellValue = mutation.target.data;
            if (cellValue !== currentState.get(cellId) &&
                mutation.type === 'characterData'
                ) {
                currentState.set(cellId,cellValue);
                updateSquareMetadata = { 
                    cellId: cellId, 
                    cellValue: cellValue 
                }
                socket.emit('updateSquare', updateSquareMetadata);
            } 
        }
    }
};

socket.on('updateSquare', function(data){
    let cellId = data['cellId']
    let cellValue = data['cellValue']

    console.log(cellId);

    var letterConfig = {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 97,
        code: "Key" + cellValue.toUpperCase(),
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        key: cellValue.toLowerCase(),
        keyCode: 97,
        location: 0,
        metaKey: false,
    }

    var backspaceConfig = {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Backspace",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        key: "Backspace",
        keyCode: 8,
        location: 0,
        metaKey: false,
    }

    var currentRect = document.getElementById('cell-id-' + cellId)

    var currentUserSquareId = document.getElementsByClassName('Cell-selected--2PAbF')[0].id

    currentRect.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    }));
    // var currentRect = document.getElementById('cell-id-' + cellId).parentElement
    // currentRect.addEventListener("keypress", event => { console.log(event)})
    // currentRect.addEventListener("keydown", event => { console.log(event)})
    currentRect.dispatchEvent(new KeyboardEvent(
        cellValue === "" ? 'keydown' : 'keypress',
        cellValue === "" ? backspaceConfig : letterConfig,
    ));

    document.getElementById(currentUserSquareId).dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    }));

    currentState.set(cellId,cellValue);
});

// Create an observer instance linked to the updateSquare function
const updateSquareObserver = new MutationObserver(updateSquare)


// Start observing the target node for configured mutations
let currentState = new Map()

// Options for the content observer (which mutations to observe)
const optionsConfig = { characterData: true, subtree: true };

// Options for the content observer (which mutations to observe)
const userStateConfig = { attributes: true };

for(let node of targetNodes) {
    let cellId = node.firstChild.id.substring(8);
    let cellValue = node.lastChild.textContent.substring(0,1);
    currentState.set(cellId,cellValue);
    // 
    updateSquareObserver.observe(node, optionsConfig);
}

console.log(currentState)

var room = "abc123";

socket.on('connect', function() {
    console.log('Client connected');
    socket.emit('room', room);
});




