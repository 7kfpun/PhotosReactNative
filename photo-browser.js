import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import PhotoBrowser from 'react-native-photo-browser';  // eslint-disable-line
import Share from 'react-native-share';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class PhotoBrowserView extends React.Component {
  onShare(media, index) {
    console.log(media, index);
    Share.open({
      title: 'React Native',
      message: 'Hola mundo',
      url: 'http://facebook.github.io/react-native/',
      subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser
          onBack={Actions.pop}
          mediaList={this.props.images}
          initialIndex={this.props.initialIndex}
          displayNavArrows={true}
          displaySelectionButtons={false}
          displayActionButton={true}
          startOnGrid={false}
          enableGrid={true}
          onActionButton={(media, index) => this.onShare(media, index)}
          itemPerRow={4}
        />
      </View>
    );
  }
}

PhotoBrowserView.propTypes = {
  images: React.PropTypes.array,
  initialIndex: React.PropTypes.number,
};

PhotoBrowserView.defaultProps = {
  images: [],
  initialIndex: 0,
};
