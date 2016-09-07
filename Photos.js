import React, { Component } from 'react';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';

// Views
import MainView from './main';
import PhotoBrowserView from './photo-browser';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Photos'} component={MainView} hideNavBar={true} initial={true} type="reset" />
    <Scene key="photoBrowser" title={'Photos'} component={PhotoBrowserView} hideNavBar={true} type="reset" />
  </Scene>
);

export default class Photos extends Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
