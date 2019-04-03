import * as THREE from 'three';

const vs = `
varying vec3 e;
varying vec3 n;
uniform float time;


void main() {

 
    float c = cos( time );
    float s = sin( time );
    mat3 m2 = mat3( c, 0, s, 0, 1, 0, -s, 0, c );	
    

  e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
  n = normalize( normalMatrix * normal );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );

}
`;

const fs = `
uniform sampler2D tMatCap;
uniform float time;
varying vec3 e;
varying vec3 n;

void main() {

   
    float c = cos( time );
    float s = sin( time );
    mat3 m2 = mat3( c, 0, s, 0, 1, 0, -s, 0, c );	
						

  vec3 r = reflect( e, n )*m2/1.2;
  float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
  vec2 vN = r.xy / m + .5;

  vec3 base = texture2D( tMatCap, vN ).rgb;

  gl_FragColor = vec4( base, 1. );

}
`;

export function MatcapMaterial(_texture, _time) {
	return new THREE.ShaderMaterial({
		uniforms: {
			tMatCap: {
				type: 't',
				value: _texture
            },
            time: {
				type: 'f',
				value: _time
			}
		},
		vertexShader: vs,
		fragmentShader: fs
	});
}
