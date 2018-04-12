function CanvasApp() {
    var canvas = document.getElementById('my-canvas');
    var context = canvas.getContext('2d');
 
    context.fillStyle = '#ccc';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#000';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    
}

CanvasApp();