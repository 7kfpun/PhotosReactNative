import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  // Switch,
  View,
  // Text,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import {
  Cell,
  Section,
  TableView,
  // CustomCell,
} from 'react-native-tableview-simple';

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

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    store.get('images')
    .then(images => {
      if (images) {
        this.setState({ images });
      }
    });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Clear all'
      this.clearImages();
    }
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
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <TableView>
          {/* <Section header={'Settings'}>
            <CustomCell>
              <Text style={styles.text}>Switch</Text>
              <Switch />
            </CustomCell>
            <CustomCell>
              <Text style={styles.text}>Switch</Text>
              <Switch />
            </CustomCell>
          </Section> */}

          <Section header={'Info'}>
            <Cell
              cellStyle="RightDetail"
              title={'Version'}
              detail={`${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
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
              }}
            />
            <Cell
              cellStyle="Basic"
              title={'Source code'}
              onPress={() => {
                Linking.openURL('https://github.com/7kfpun/PhotosReactNative');
              }}
            />
          </Section>

          <Section header={'Others'}>
            <Cell
              cellStyle="Basic"
              title={'View more by this developer'}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('https://itunes.apple.com/us/developer/kf-pun/id1116896894');
                } else if (Platform.OS === 'android') {
                  Linking.openURL('https://play.google.com/store/apps/developer?id=Kf');
                }
              }}
            />
          </Section>
        </TableView>

        <AdmobCell />
      </View>
    );
  }
}

SettingsView.propTypes = {
  title: React.PropTypes.string,
};

SettingsView.defaultProps = {
  title: '',
};
