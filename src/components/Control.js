import './../../node_modules/react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';

import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString,
  DatButton
} from 'react-dat-gui';

import Scene from '../components/Scene';

class Control extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        texture: null,
        speedRot: 0.1,
        texRot: false,
        heartRot: false,
        background: '#ffffff'
      }
    };
  }

  handleUpdate = data => this.setState({ data });

  handleTexture = () => {
    console.log('yea');
    document.getElementById('myInput').click();
  };

  handleFile = e => {
    let FReader = new FileReader();
    let file = document.getElementById('myInput').files[0];
    if (file) {
      FReader.readAsDataURL(file);
    }

    FReader.onloadend = () => {
      console.log(FReader.result);
      this.setState({
        data: {
          ...this.state.data,
          dataURL: FReader.result
        }
      });
      console.log(this.state);
    };
  };

  render() {
    const { data } = this.state;

    return (
      <div>
        <DatGui data={data} onUpdate={this.handleUpdate}>
          <DatButton
            path="texture"
            label="Upload Reflection Texture"
            onClick={this.handleTexture}
          />
          <DatBoolean path="texRot" label="Rotate Texture" />
          <DatBoolean path="heartRot" label="Rotate Object" />
          <DatNumber
            path="speedRot"
            label="Rotation Speed"
            min={0}
            max={1}
            step={0.001}
          />
          <DatColor path="background" label="Background" />
        </DatGui>
        <input
          type="file"
          id="myInput"
          style={{ visibility: 'hidden' }}
          onChange={this.handleFile}
        />

        <Scene data={data} />
      </div>
    );
  }
}
export default Control;
