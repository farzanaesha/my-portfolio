let selectedNode = null;
let isConnecting = false;

// Function to add a new node to the canvas
function fcQ(type, label) {
    const canvas = document.querySelector('.fcw');
    const node = document.createElement('div');
    node.className = `fn ${type}`;
    node.style.left = '50px';
    node.style.top = '50px';
    node.innerHTML = `<span class="nl">${label}</span>`;
    
    // Make node draggable
    node.onmousedown = (e) => startDrag(e, node);
    node.onclick = () => selectNode(node);
    
    canvas.appendChild(node);
}

function startDrag(e, node) {
    let shiftX = e.clientX - node.getBoundingClientRect().left;
    let shiftY = e.clientY - node.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        node.style.left = pageX - shiftX - 56 + 'px'; // Subtract sidebar width
        node.style.top = pageY - shiftY - 100 + 'px'; // Adjust for header
    }

    function onMouseMove(e) { moveAt(e.pageX, e.pageY); }

    document.addEventListener('mousemove', onMouseMove);
    node.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        node.onmouseup = null;
    };
}
