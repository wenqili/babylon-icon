import * as THREE from 'three';

const vs = `
varying vec2 vUv;
void main() {

	vUv = uv;
	gl_Position = vec4( position, 1.0 );

}
`;

const fs = `
uniform sampler2D texture;
uniform float time;
uniform float startPos;
varying vec2 vUv;

float offset = 0.005;
float noiseIntensity = 0.01;
float speed = 1.5;


vec3 permute(in vec3 x) { 
    return mod( x*x*34.+x, 289.); 
}

float snoise(in vec2 v) {
	vec2 i = floor((v.x+v.y)*.36602540378443 + v),
		x0 = (i.x+i.y)*.211324865405187 + v - i;
	float s = step(x0.x,x0.y);
	vec2 j = vec2(1.0-s,s),
		x1 = x0 - j + .211324865405187, 
		x3 = x0 - .577350269189626; 
	i = mod(i,89.);
	vec3 p = permute( permute( i.y + vec3(0, j.y, 1 ))+ i.x + vec3(0, j.x, 1 )   ),
		 m = max( .5 - vec3(dot(x0,x0), dot(x1,x1), dot(x3,x3)), 0.),
		 x = fract(p * .024390243902439) * 2. - 1.,
		 h = abs(x) - .5,
		a0 = x - floor(x + .5);
	return .5 + 65. * dot( pow(m,vec3(4.))*(- 0.85373472095314*( a0*a0 + h*h )+1.79284291400159 ), a0 * vec3(x0.x,x1.x,x3.x) + h * vec3(x0.y,x1.y,x3.y));
  }


void main() {
	vec2 uv = vUv;
	float t = time*speed;
	float s = smoothstep(startPos,1.,uv.x);
	// uv.x += s;
	uv.x += s * snoise(uv*(noiseIntensity*(s+1.2)));
	// uv.y -= s * snoise(uv*(noiseIntensity*(s/10.7+1.2))-vec2(t*1.2,0.));
	float r = texture2D(texture,vec2(uv.x - offset, uv.y )).r;
    float g = texture2D(texture,uv).g;
    float b = texture2D(texture,vec2(uv.x - 2.0*offset, uv.y )).b;

	// if(uv.x > startPos + 0.05){
    //     gl_FragColor = vec4(r,g,b,1.0);
    // }else{
        gl_FragColor = texture2D(texture,uv);
    // }
	
}
`;

export function CanooMaterial(_texture, _time, _startPos) {
	return new THREE.ShaderMaterial({
		uniforms: {
			texture: {
				type: 't',
				value: _texture
			},
			time: {
				type: 'f',
				value: _time
			},
			startPos:{
				type: 'f',
				value: _startPos
			}
		},
		vertexShader: vs,
		fragmentShader: fs
	});
}
