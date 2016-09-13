import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import CameraRollPicker from 'react-native-camera-roll-picker';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

// Component
import AdmobCell from './admob';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  preview: {
    paddingHorizontal: 5,
    backgroundColor: '#424242',
  },
  imageBlock: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').width / 2,
    resizeMode: 'cover',
  },
  markerBlock: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#B366FF',
    width: DeviceInfo.getModel().indexOf('iPad') !== -1 ? (Dimensions.get('window').width / 8) - 6 : (Dimensions.get('window').width / 4) - 6,
    height: DeviceInfo.getModel().indexOf('iPad') !== -1 ? (Dimensions.get('window').width / 8) - 6 : (Dimensions.get('window').width / 4) - 6,
  },
  marker: {
    margin: 5,
    height: 20,
    width: 20,
  },
  footer: {
    height: 55,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#424242',
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
  startText: {
    fontSize: 16,
    color: '#B366FF',
  },
});

export default class MainView extends Component {
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

  getSelectedImages(images) {
    console.log(images);
    const tempImages = images.map((item) => Object.assign({ photo: item.uri }, item));
    this.setState({ images: tempImages });
    store.save('images', tempImages);
  }

  clearImages() {
    this.setState({ images: [] });
    store.save('images', []);
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#212121', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#F5F5F5' }}
          rightButton={{
            title: this.state.images.length > 0 ? 'Clear all' : '',
            tintColor: '#69BBFF',
            handler: () => this.clearImages(),
          }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={
            this.state.images.length > 0 ? [{ title: 'Clean all', iconName: 'md-trash', iconColor: 'white', show: 'always' }] : []
          }
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView style={styles.preview} horizontal={true}>
          {this.state.images.length > 0 && this.state.images.map((item, i) => <View key={i} style={styles.imageBlock}>
            <Image
              style={styles.image}
              source={{ uri: item.uri }}
            />
          </View>)}

          {this.state.images.length === 0 && <View style={{ width: Dimensions.get('window').width - 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Select some of your photos</Text>
          </View>}
        </ScrollView>

        <CameraRollPicker
          key={this.state.key}
          callback={(images) => this.getSelectedImages(images)}
          imagesPerRow={DeviceInfo.getModel().indexOf('iPad') !== -1 ? 8 : 4}
          backgroundColor="#212121"
          maximum={100}
          selected={this.state.images}
          selectedMarker={<View style={styles.markerBlock}>
            <Image source={require('../assets/checkmark-circle.png')} style={styles.marker} />
          </View>}
        />

        <AdmobCell />

        <TouchableHighlight
          style={styles.footer}
          onPress={() => {
            if (this.state.images.length > 0) {
              Actions.photoBrowser({ images: this.state.images });
            }
          }}
          underlayColor="#424242"
        >
          <Text style={styles.startText}>Start your Photo Gallery</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

MainView.propTypes = {
  title: React.PropTypes.string,
};

MainView.defaultProps = {
  title: '',
};
