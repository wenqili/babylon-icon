const fs = `
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

uniform vec3 lightpos;
uniform sampler2D color_map;
uniform sampler2D normal_map;
uniform sampler2D specular_map;
uniform sampler2D ao_map;
uniform sampler2D matcap_map;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vNM;

vec2 enlight(vec3 p, vec3 n, vec3 lp){
    vec3 toLight=normalize(lp-p);
    float lamb=clamp(dot(n,toLight),0.0,1.0);
    vec3 rd=normalize(p-cameraPosition);
    vec3 nr=n*dot(n,-rd);
    vec3 refl=normalize(-rd+(nr+rd)*2.0);
    float fresnel=1.0-clamp(dot(n,-rd),0.0,1.0);
    float phong = pow(clamp(dot(refl, toLight),0.0,1.0),120.0);
    phong*=(1.0+fresnel)*lamb;
    return vec2(lamb, phong);
}


void main(){
    vec3 lp=lightpos;

    vec3 p=(modelMatrix*vec4(vPosition, 1.0)).xyz;
    vec3 n=normalize(vec3(modelMatrix*vec4(vNormal,0.0)));
    vec2 uv = vUv;

    float ns=1.0;

    vec3 t=p;
    vec3 ts=p*100.0;

    vec2 tx=vec2(sin(ts.y),sin(ts.z));
    vec2 ty=vec2(sin(ts.x),sin(ts.z));
    vec2 tz=vec2(sin(ts.x),sin(ts.y));

    tx=texture2D(normal_map, uv).rg-0.5;
    ty=texture2D(normal_map, uv).rg-0.5;
    tz=texture2D(normal_map, uv).rg-0.5;

    vec3 nx=normalize(n*ns+tx.x*cross(n,vec3(0,0,1))+tx.y*cross(n,vec3(0,1,0)));
    vec3 ny=normalize(n*ns+ty.x*cross(n,vec3(0,0,1))+ty.y*cross(n,vec3(0,1,0)));
    vec3 nz=normalize(n*ns+tz.x*cross(n,vec3(0,1,0))+tz.y*cross(n,vec3(1,0,0)));

    vec3 w=abs(n);
    w=vec3(pow(w.x,100.0),pow(w.y,100.0),pow(w.z,100.0));
    w/=dot(w,vec3(1,1,1));
    n=normalize(nx*w.x+ny*w.y+nz*w.z);

    //three lights
    vec2 l1=enlight(p,n,lp)*0.8;
    vec2 l2=enlight(p,n,vec3(lp.z,lp.y,-lp.x))*0.6;
    vec2 l3=enlight(p,n,-lp)*0.4;

    float lamb=l1.x + l2.x + l3.x;
    float phong=l1.y + l2.y + l3.y;

    vec3 rd=normalize(p-cameraPosition);
    vec3 nr=n*dot(n,-rd);
    vec3 refl=normalize(-rd+(nr+rd)*2.0);
    float fresnel=1.0-clamp(dot(n,-rd),0.0,1.0);

    vec3 rc = texture2D( matcap_map, vNM ).rgb * texture2D(specular_map, uv).rgb; //matcap
    vec4 ao = texture2D(ao_map, uv) * 1.6;
    vec3 color = texture2D(color_map, uv).rgb;

    gl_FragColor = ao*vec4( lamb*color+(0.3+fresnel*0.5)*rc*(0.6+color*0.3)+phong, 1.0 );

}
`;

const vs = `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vNM;

void main() {

    vNormal = normal;
    vUv = uv;
    vPosition = position;

    //matcap
    vec4 p = vec4( position, 1. );
    vec3 e = normalize( vec3( modelViewMatrix * p ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vNM = r.xy / m + .5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export function SatMaterial(_color, _normal, _specular, _ao, _matcap) {
	return new THREE.ShaderMaterial({
		uniforms: {
			color_map: {
				type: 't',
				value: _color
			},
			normal_map: {
				type: 't',
				value: _normal
			},
			specular_map: {
				type: 't',
				value: _specular
			},
			ao_map: {
				type: 't',
				value: _ao
			},
			matcap_map: {
				type: 't',
				value: _matcap
			},
			lightpos: {
				type: 'v3',
				value: new THREE.Vector3(400.0, 200.0, -200.0)
			}
		},
		vertexShader: vs,
		fragmentShader: fs
	});
}
