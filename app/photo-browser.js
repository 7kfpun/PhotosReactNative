import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
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
      title: 'Photo shared from Look Lock',
      message: 'Photo shared from Look Lock',
      url: media.uri,
      // subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  backHandler() {
    if (Platform.OS === 'ios') {
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
    } else {
      Actions.pop();
    }
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
          itemPerRow={DeviceInfo.getModel().indexOf('iPad') !== -1 ? 8 : 4}
        />
      </View>
    );
  }
}

PhotoBrowserView.propTypes = {
  images: React.PropTypes.arrayOf(React.PropTypes.object),
  initialIndex: React.PropTypes.number,
};

PhotoBrowserView.defaultProps = {
  images: [],
  initialIndex: 0,
};
