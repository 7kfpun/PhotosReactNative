import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Share from 'react-native-share';

// Component
import AdmobCell from './admob';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  navigatorBarIOS: {
    backgroundColor: '#212121',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#424242',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#0A0A0A',
    elevation: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
});

export default class InfoView extends Component {
  onShareApp() {
    Share.open({
      title: 'Look Lock',
      message: 'Look Lock - Show photos without worries.',
      url: 'http://onelink.to/kzb9bx',
      // subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#212121', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#F5F5F5' }}
          rightButton={{
            title: 'Close',
            tintColor: '#69BBFF',
            handler: Actions.pop,
          }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          navIconName="md-arrow-back"
          onIconClicked={Actions.pop}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('info');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView>
          <TableView>
            <Section header={'Info'}>
              <Cell
                cellStyle="RightDetail"
                title={'Version'}
                detail={`${DeviceInfo.getReadableVersion()}`}
              />
            </Section>

            <Section header={'Others'}>
              <Cell
                cellStyle="Basic"
                title={'Share this cool app!'}
                onPress={() => {
                  this.onShareApp();
                  GoogleAnalytics.trackEvent('user-action', 'share-app');
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'Rate us'}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('itms-apps://itunes.apple.com/app/id1151863742');
                  } else if (Platform.OS === 'android') {
                    Linking.openURL('market://details?id=com.kfpun.photos');
                  }
                  GoogleAnalytics.trackEvent('user-action', 'open-url', { label: 'rate-us' });
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'Source code'}
                onPress={() => {
                  Linking.openURL('https://github.com/7kfpun/PhotosReactNative');
                  GoogleAnalytics.trackEvent('user-action', 'open-url', { label: 'open-source' });
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'View more by this developer'}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('https://itunes.apple.com/us/developer/kf-pun/id1116896894');
                  } else if (Platform.OS === 'android') {
                    Linking.openURL('https://play.google.com/store/apps/developer?id=Kf');
                  }
                  GoogleAnalytics.trackEvent('user-action', 'open-url', { label: 'more-by-developer' });
                }}
              />
            </Section>
          </TableView>

          <AdmobCell bannerSize="mediumRectangle" />
        </ScrollView>
      </View>
    );
  }
}

InfoView.propTypes = {
  title: React.PropTypes.string,
};

InfoView.defaultProps = {
  title: '',
};
