import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import PasscodeAuth from 'react-native-passcode-auth';
import PhotoBrowser from 'react-native-photo-browser';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
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
      title: 'Photo shared from Limited Photos',
      message: 'https://github.com/7kfpun/PhotosReactNative',
      url: media.uri,
      // subject: 'Share Link',
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
            Actions.pop();
          })
          .catch(error => {
            console.log('Authentication Failed', error);
          });
      })
      .catch(() => {
        PasscodeAuth.authenticate(reason)
        .then(success => {
          console.log('Authenticated Successfully', success);
          Actions.pop();
        })
        .catch(eerror => {
          console.log('Authentication Failed', eerror);
        });
      });
  }

  render() {
    GoogleAnalytics.trackScreenView('photo-browser');
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
