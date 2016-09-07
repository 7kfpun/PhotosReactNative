import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import PasscodeAuth from 'react-native-passcode-auth';
import PhotoBrowser from 'react-native-photo-browser';  // eslint-disable-line
import Share from 'react-native-share';
import TouchID from 'react-native-touch-id';

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

  backHandler() {
    const reason = 'You need to be the owner of the device.';

    TouchID.isSupported()
      .then(() => {
        // Success code
        console.log('TouchID is supported.');
        TouchID.authenticate(reason)
          .then(success => {
            console.log('Authenticated Successfully', success);
            Actions.main();
          })
          .catch(error => {
            console.log('Authentication Failed', error);
          });
      })
      .catch(() => {
        PasscodeAuth.authenticate(reason)
        .then(success => {
          console.log('Authenticated Successfully', success);
          Actions.main();
        })
        .catch(eerror => {
          console.log('Authentication Failed', eerror);
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser
          onBack={() => this.backHandler()}
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
