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
import Sound from 'react-native-sound';

// Component
import AdmobCell from './admob';

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
      message: 'Show photos without worries http://onelink.to/kzb9bx ',
      url: media.uri,
      // subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  backHandler() {
    const vibrateSoundPop = () => {
      Vibration.vibrate();

      const sound = new Sound('button.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error playing sound', error);
        } else {
          console.log('duration', sound.getDuration());
          sound.play();
        }
      });

      Actions.pop();
    };

    if (Platform.OS === 'ios') {
      PasscodeAuth.isSupported()
        .then(() => {
          const reason = 'You need to be the owner of the device.';
          PasscodeAuth.authenticate(reason)
          .then(success => {
            console.log('Authenticated Successfully', success);
            vibrateSoundPop();
          })
          .catch(eerror => {
            console.log('Authentication Failed', eerror);
          });
        })
        .catch(error => {
          console.log('PasscodeAuth not supported', error);
          vibrateSoundPop();
        });
    } else {
      vibrateSoundPop();
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

        <AdmobCell />
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
