var gl
var program;
var lastFrameTime = Date.now();
var fps = 0;

const clipBox = [
    -1, 1,  // Upper left
    1, 1,   // Upper right
    -1, -1, // Lower left
    1, -1,  // Lower right
];


window.onload = function init() {
    
    const canvas = document.querySelector('canvas');
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // create the clipbox buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(clipBox), gl.STATIC_DRAW);

    // create the position attribute
    const pos = gl.getAttribLocation(program, 'vPosition');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // render
    requestAnimationFrame(render);

    // updated frame rate every 300 ms
    setInterval(() => {
        const text = `FPS: ${fps.toFixed(1)} fps`;
        document.getElementById('fps').textContent = text;
    }, 300);
}

function render() {

    // for frame rate calculation
    const currFrameTime = Date.now();
    fps = 1000 / (currFrameTime - lastFrameTime);
    lastFrameTime = currFrameTime;

    // number of bounces from the mirrors uniform variable
    gl.uniform1f(
        gl.getUniformLocation(program, 'num_bounces'),
        parseFloat(document.getElementById('number-bounces').value),
    );

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}
