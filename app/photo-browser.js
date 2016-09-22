import React from 'react';

import {
  Platform,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import PasscodeAuth from 'react-native-passcode-auth';
import PhotoBrowser from 'react-native-photo-browser';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
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
      title: 'Photo shared from Look Lock',
      message: 'Photo shared from Look Lock',
      url: media.uri,
      // subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  backHandler() {
    const vibrateAndPop = () => { Vibration.vibrate(); Actions.pop(); };

    if (Platform.OS === 'ios') {
      PasscodeAuth.isSupported()
        .then(() => {
          const reason = 'You need to be the owner of the device.';
          PasscodeAuth.authenticate(reason)
          .then(success => {
            console.log('Authenticated Successfully', success);
            vibrateAndPop();
          })
          .catch(eerror => {
            console.log('Authentication Failed', eerror);
          });
        })
        .catch(error => {
          console.log('PasscodeAuth not supported', error);
          vibrateAndPop();
        });
    } else {
      vibrateAndPop();
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
