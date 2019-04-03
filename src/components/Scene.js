import React, { Component } from 'react';
import * as THREE from 'three';
// import {CanooMaterial} from './shaders/canoo_1.shader';
import { MatcapMaterial } from './shaders/matcap.shader';

import { AssetLoader } from './../util/assetsLoader';
import Control from './Control';

const assets = [
  {
    url: require('../assets/heart.obj'),
    type: 'OBJ'
  },
  {
    url: require('../assets/g.png'),
    type: 'PNG'
  }
];

class Scene extends Component {
  constructor(props) {
    super(props);
    this.ready = false;
  }

  init() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const loader = new AssetLoader();

    this.scene = new THREE.Scene();

    //canoo
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // this.camera.position.z = 5;

    this.camera.position.z = 75;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xffffff);
    this.mount.appendChild(this.renderer.domElement);

    loader
      .loadAll(assets)
      .then(data => {
        const geometry = data[0].children[0].geometry;
        geometry.computeVertexNormals();
        geometry.center();

        const geo = new THREE.Geometry().fromBufferGeometry(geometry);
        geo.mergeVertices();
        geo.computeVertexNormals();

        this.mesh = new THREE.Mesh(geo, MatcapMaterial(data[1], 0.0));
        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.scene.add(this.mesh);

        this.ready = true;
      })
      .catch(error => {
        console.log(error);
      });

    document.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('resize', this.resize);
  }

  componentDidMount() {
    this.init();
    this.start();
  }
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    document.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('resize', this.resize);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  mouseMove = event => {
    const x = event.clientX / this.mount.clientWidth;
  };

  renderScene = () => {
    if (this.ready == true) {
      if (this.props.data.texRot) {
        this.mesh.material.uniforms.time.value += 0.01;
      }

      if (this.props.data.heartRot) {
        this.mesh.rotation.y += 0.01;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };
  resize = () => {
    this.w = this.mount.clientWidth;
    this.h = this.mount.clientHeight;

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);
  };
  render() {
    console.log(this.props);
    return (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          left: '0',
          top: '0'
        }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Scene;
