const canvas = document.getElementById('fluidCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
}

canvas.width = 800;
canvas.height = 500;

// Vertex Shader
const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
        v_uv = (a_position + 1.0) * 0.5; // Convert from clip space to UV coordinates
        gl_Position = vec4(a_position, 0, 1);
    }
`;

// Fragment Shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float time;
    uniform vec2 resolution;
    
    void main() {
        vec2 uv = v_uv;
        float color = 0.5 + 0.5 * sin(time + uv.x * 10.0);
        gl_FragColor = vec4(color, color, 1.0, 1.0);
    }
`;

// Function to Compile Shader
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error: ', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Compile Shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create Shader Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader program linking error: ', gl.getProgramInfoLog(program));
}

// Use the Shader Program
gl.useProgram(program);

// Get Uniform Locations
const resolutionLocation = gl.getUniformLocation(program, 'resolution');
const timeLocation = gl.getUniformLocation(program, 'time');

// Set Resolution Uniform
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Create Full-Screen Triangle
const vertices = new Float32Array([
    -1, -1,  // Bottom-left
     3, -1,  // Bottom-right (Oversized for full coverage)
    -1,  3   // Top-left
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

let time = 0;

// Render Loop
function render() {
    time += 0.02;
    gl.uniform1f(timeLocation, time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Render the full-screen triangle
    requestAnimationFrame(render);
}

render();
