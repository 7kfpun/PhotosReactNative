import React from 'react';

import {
  Alert,
  BackAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  Vibration,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions, ActionConst } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import PasswordGesture from 'react-native-gesture-password';
import store from 'react-native-simple-store';

let firstPassword = '';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 55,
    backgroundColor: '#292B38',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#B366FF',
    textAlign: 'center',
  },
});

export default class PasswordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Set a password before hand out your phone',
      status: 'normal',
      isLock: this.props.isLock,
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => this.handleBackAndroid());

    if (this.props.isLock === false) {
      firstPassword = '';
      this.onReset();
    }
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', () => this.handleBackAndroid());
  }

  onEnd(password) {
    if (this.state.isLock === false) {
      if (firstPassword === '') {
        firstPassword = password;
        this.setState({
          key: Math.random(),
          status: 'normal',
          message: 'Please input your password secondly',
        });
      } else if (firstPassword !== '' && password === firstPassword) {
        store.save('password', firstPassword);
        firstPassword = '';

        this.setState({
          key: Math.random(),
          message: 'Please input the password',
          status: 'normal',
          isLock: true,
        });
        Actions.photoBrowser({ images: this.props.images });
      } else {
        this.setState({
          status: 'wrong',
          message: 'Not the same, try again!',
        });
      }
    } else {
      store.get('password')
      .then((savedPassword) => {
        if (password === savedPassword) {
          this.setState({
            status: 'right',
            message: 'Password is right, success.',
            isLock: false,
          });

          store.delete('password');
          Actions.main({ type: ActionConst.RESET });
          if (Math.random() > 0.5) {
            this.showAdInterstitial();
            GoogleAnalytics.trackEvent('system-action', 'show-ad-interstitial');
          }
          GoogleAnalytics.trackEvent('user-action', 'input-password', { label: 'right' });
        } else {
          this.setState({
            status: 'wrong',
            message: 'Password is wrong, try again!',
          });
          GoogleAnalytics.trackEvent('user-action', 'input-password', { label: 'wrong' });
        }
      });

      Vibration.vibrate();
    }
  }

  onStart() {
    if (this.state.isLock === false) {
      if (firstPassword === '') {
        this.setState({
          message: 'Set a password before hand out your phone',
        });
      } else {
        this.setState({
          message: 'Please input your password secondly',
        });
      }
    } else {
      this.setState({
        status: 'normal',
        message: 'Please input the password',
      });
    }
  }

  onReset() {
    this.setState({
      key: Math.random(),
      message: 'Set a password before hand out your phone',
      status: 'normal',
    });
  }

  showAdInterstitial() {
    AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log('AdMobInterstitial', error)));
  }

  handleBackAndroid() {
    console.log('handleBackAndroid');
    if (this.state.isLock === true) {
      return true;
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('password');
    return (
      <View style={styles.container}>
        <PasswordGesture
          key={this.state.key}
          status={this.state.status}
          message={this.state.message}
          onStart={() => this.onStart()}
          onEnd={password => this.onEnd(password)}
          normalColor="#B366FF"
          rightColor="#B366FF"
        />

        {this.state.isLock && <TouchableHighlight
          style={styles.footer}
          onPress={() => {
            Alert.alert(
              'You need to be the owner of the device.',
              'Hand the phone back to the owner if you have finished enjoying the photos.',
              [
                { text: 'Cancel', onPress: () => true },
                { text: 'Exit app', onPress: () => BackAndroid.exitApp() },
                {
                  text: 'Continue with the photos',
                  onPress: () => {
                    Actions.photoBrowser({ images: this.props.images });
                    this.onReset();
                    GoogleAnalytics.trackEvent('user-action', 'continue-with-photos');
                  },
                },
              ]
            );
          }}
          underlayColor="#424242"
        >
          <Text style={styles.text}>Hand the phone back or continue with the photos</Text>
        </TouchableHighlight>}
      </View>
    );
  }
}

PasswordView.propTypes = {
  isLock: React.PropTypes.bool,
  images: React.PropTypes.arrayOf(React.PropTypes.object),
};

PasswordView.defaultProps = {
  isLock: false,
  images: [],
};
