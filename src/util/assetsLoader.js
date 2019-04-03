import * as THREE from 'three';
import 'three-examples/loaders/OBJLoader';


export class AssetLoader {
	constructor(_MANAGER) {
		this.THREE = THREE;
		if (!_MANAGER) this.manager = new THREE.LoadingManager();
		this.manager.onProgress = function(url, itemsLoaded, itemsTotal) {
			let percentage = Math.round(itemsLoaded / itemsTotal * 100);
			console.log(percentage + '% loaded');
			// if (percentage === 100) $('#blocker1').fadeOut(1500);
		};

		this.objLoader = new THREE.OBJLoader(_MANAGER ? _MANAGER : this.manager);
		this.textureLoader = new THREE.TextureLoader(
			_MANAGER ? _MANAGER : this.manager
		);
	}

	load(_URL, _TYPE) {
		return new Promise((resolve, reject) => {
			if (_TYPE === 'OBJ') {
				this.objLoader.load(_URL, (result, error) => {
					if (result) resolve(result);
					if (error) reject(new Error(`Couldn't find this file: ${_URL}`));
				});
			} else if (_TYPE === 'JPG' || 'PNG') {
				this.textureLoader.load(_URL, (result, error) => {
					if (result) resolve(result);
					if (error) reject(new Error(`Couldn't find this file: ${_URL}`));
				});
			}
		});
	}

	loadAll(_ASSETS) {
		return Promise.all(_ASSETS.map(asset => this.load(asset.url, asset.type)));
	}
}
