/**
 * 获得canvas2d
 * @param {*} id canvas的id
 */
function getCavasContext(id) {
    var canvas = document.getElementById('my-canvas');
    var context = canvas.getContext('2d');

    return {
        context: context,
        width: canvas.width,
        height: canvas.height,
    };
}

/**
 * 画直线
 * @param {*} context 
 */
function drawLine(context) {
    context.strokeStyle = 'red';
    context.lineWidth = 20;
    // 画出三个，原点为（100， 100），间隔距离为100
    var x = 100;
    var lineCapArr = ['butt', 'round', 'square'];
    var lineJoinArr = ['miter', 'bevel', 'round'];
    for (var i = 0; i < 3; i++) {
        context.lineCap = lineCapArr[i];
        context.lineJoin = lineJoinArr[i];
        context.beginPath();
        context.moveTo(100 + i * x, 100);
        context.lineTo(100 + i * x, 300);
        context.lineTo(150 + i * x, 250);
        context.stroke();
        context.closePath();
    }
}

/**
 * 画弧线
 * @param {*} context 
 */
function drawArc(context) {
    context.strokeStyle = 'red';
    context.lineWidth = 5;
    context.beginPath();

    context.moveTo(100, 100);

    context.arc(150, 150, 50, Math.PI / 2, 2 * Math.PI);


    // 平方贝塞尔曲线
    context.moveTo(200, 100);
    context.quadraticCurveTo(100, 25, 200, 400)

    context.stroke();

    context.closePath();
}

/**
 * 旋转和缩放变换
 * @param {*} context 
 */
function drawTransform(context) {
    
    var x = 100, y = 100, width = 1, height = 200;

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.translate(x + width / 2, y + height / 2);
    for (var i = 0; i <= 360; i += 30) {
        var radians = 30 * Math.PI / 180.00
        console.log(radians);
        context.rotate(radians);
        context.fillStyle = 'green';
        context.fillRect(- width / 2, - height / 2, width, height);
        console.log(i);
    }
}

/**
 * 填充颜色和渐变
 * @param {*} context 
 */
function drawColor(context) {
    var x0 = 100, y0 = 100, r0 = 25, x1 = 300, y1 = 300, r1 = 50;

    // var gr = context.createLinearGradient(100, 0, 400, 0);
    var gr = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
    gr.addColorStop(0, 'rgb(3, 3, 3)');
    gr.addColorStop(.5, 'rgb(0, 255, 0)');
    gr.addColorStop(1, 'rgb(255, 0, 0)');
    context.fillStyle = gr;
    context.fillRect(100, 100, 300, 300)
    context.strokeRect(100, 100, 300, 300);

    // 画出两个圆
    context.beginPath();

    context.strokeStyle = 'blue';

    context.moveTo(x0, y0);
    context.arc(x0, y0, r0, 0, 2 * Math.PI);

    context.moveTo(x1, y1);
    context.arc(x1, y1, r1, 0, 2 * Math.PI);

    context.stroke();
    context.closePath();

}

function drawShadow(context) {
    context.fillStyle = 'black';
    context.shadowOffsetX = -10;
    context.shadowOffsetY = -10
    context.shadowBlur = 4;
    context.shadowColor = 'red';
    context.fillRect(100, 100, 300, 300);
  
}

(function draw(canvas){
    // 背景
    canvas.context.fillStyle = '#eee';
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
    canvas.context.strokeStyle = '#000';
    canvas.context.strokeRect(0, 0, canvas.width, canvas.height);

    // drawLine(canvas.context);
    // drawArc(canvas.context);
    // drawTransform(canvas.context);
    // drawColor(canvas.context);
    drawShadow(canvas.context);

})(getCavasContext('my-canvas'));