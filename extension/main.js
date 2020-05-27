const connectionOptions =  {
         "force new connection" : true,
         "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
         "timeout" : 10000, //before connect_error and connect_timeout are emitted.
         "transports" : ["websocket"]
 };

const curr_ngrok = 'e9fd039d.ngrok.io'

const socket = io("wss://" + curr_ngrok, connectionOptions);
// const socket = io('http://localhost:3000');

// Select the node that will be observed for mutations
const targetNodes = document.querySelectorAll('g[data-group="cells"] > g');

// Options for the observer (which mutations to observe)
const config = { characterData: true, subtree: true };

// Callback function to execute when mutations are observed
const updateSquare = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.target.parentNode.attributes[0].value !== 'Cell-hidden--3xQI1') {
            let cellId = mutation.target.parentNode.parentNode.firstChild.attributes[3].value.substring(8);
            let cellValue = mutation.target.data;
            currentState.set(cellId,cellValue);
            console.log(currentState)
            updateSquareMetadata = { 
                cellId: cellId, 
                cellValue: cellValue 
            }
            socket.emit('updateSquare', updateSquareMetadata);
        } 
    }
};

socket.on('updateSquare', function(data){
    console.log(data);
    let cellId = data['cellId']
    let cellValue = data['cellValue']
    console.log(cellId);
    console.log(cellValue);
    var replacementInnerHTML = '<text class="Cell-hidden--3xQI1" aria-live="polite">' + cellValue + '</text>' + cellValue
    console.log(replacementInnerHTML)
    var currentSquare = document.getElementById('cell-id-' + cellId)
    console.log(currentSquare)
    currentSquare.parentElement.lastChild.innerHTML = replacementInnerHTML
    console.log(currentSquare.parentElement.lastChild.innerHTML)
    currentState.set(cellId,cellValue);
    console.log(data);
});

// Create an observer instance linked to the updateSquare function
const observer = new MutationObserver(updateSquare)

// Start observing the target node for configured mutations
// targetNodes.foreach(node => observer.observe(node, config));

let currentState = new Map()
// myMap.set('bla','blaa')

for(let node of targetNodes) {
    let cellId = node.firstChild.id.substring(8);
    let cellValue = node.lastChild.textContent.substring(0,1);
    currentState.set(cellId,cellValue);
    observer.observe(node, config);
}

console.log(currentState)

var room = "abc123";

socket.on('connect', function() {
    console.log('Client connected');
    socket.emit('room', room);
});




