/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as LoadingConstants from './redux/LoadingStateConstants';
import * as UIConstants from './redux/UIConstants';
import ModelItemRender from './component/ModelItemRender';
import PortalItemRender from './component/PortalItemRender';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


import {
  ViroScene,
  ViroARScene,
  ViroARNode,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroBox,
  ViroMaterials,
  ViroNode,
  ViroOmniLight,
  ViroOrbitCamera,
  ViroImage,
  ViroVideo,
  ViroSkyBox,
  Viro360Video,
  ViroText,
  ViroSurface,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight
} from 'react-viro';

import TimerMixin from 'react-timer-mixin';


var figment = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      text : "not tapped",
      currentObj: 0,
      isLoading: false,
      scaleSurface: [1,1,1],
    }
  },

  render: function() {
    console.log("Figment; Rerender AR Scene OCCURRED");
    return (
        <ViroARScene ref="arscene" reticleEnabled={false} physicsWorld={{gravity:[0, -9.81, 0]}} >
            <ViroDirectionalLight color="#ffffff" direction={[0,-1,-.2]}/>
            <ViroAmbientLight color="#ffffff" intensity={200}/>

            <ViroSpotLight
              innerAngle={5}
              outerAngle={90}
              direction={[0,-1,0]}
              position={[0, 5, 0]}
              color="#ffffff"/>


            <ViroSpotLight
              innerAngle={5}
              outerAngle={90}
              direction={[0,1,0]}
              position={[0, -5, 0]}
              color="#ffffff"
              intensity={500}/>

            {this.renderModels(this.props.modelItems)}
            {this.renderPortals(this.props.portalItems)}
        </ViroARScene>
    );
  },

  renderModels(modelItems) {
    var renderedObjects = [];
    if(modelItems) {
      for(var i =0; i<modelItems.length; i++) {
        if(modelItems[i].selected) {
          console.log("Figment: Pushing VIRO 3DOBJECT index:" + i);
          var j = i;
          renderedObjects.push(
            <ModelItemRender key={j} modelItem={modelItems[j]} index={j} hitTestMethod={this._performARHitTest} onLoadCallback={this._onLoadCallback} onClickStateCallback={this._onModelsClickStateCallback} />
          );
        }
      }
    }
    return renderedObjects;
  },

  renderPortals(portalItems) {
    var renderedObjects = [];
    if(portalItems) {
      for(var i =0; i<portalItems.length; i++) {
        if(portalItems[i].selected) {
          console.log("Figment: Pushing VIRO PORTAL index:" + i);
          var j = i;
          renderedObjects.push(
            <PortalItemRender key={j} portalItem={portalItems[j]} index={j} hitTestMethod={this._performARHitTest} onLoadCallback={this._onLoadCallback} onClickStateCallback={this._onPortalsClickStateCallback}/>
          );
        }
      }
    }
    return renderedObjects;
  },

  _performARHitTest(callback) {
    this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
      this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
        callback(orientation.forward, results);
      })
    });
  },

  _onLoadCallback(index, loadState) {
    console.log("_onLoadCallback" + index + ", loadCallback:" + loadState);
    this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(index, loadState);
  },
  _onModelsClickStateCallback(index, clickState, itemType) {
    console.log("_onClickStateCallback - index: " + index + ", clickState: " + clickState);
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(index, clickState, itemType);
  },
  _onPortalsClickStateCallback(index, clickState, itemType) {
    console.log("_onClickStateCallback - index: " + index + ", clickState: " + clickState);
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(index, clickState, itemType);
  },
});

function selectProps(store) {
  return {
    modelItems: store.arobjects.modelItems,
    portalItems: store.arobjects.portalItems,
  };
}

module.exports = connect(selectProps)(figment);