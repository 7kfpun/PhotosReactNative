import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Modal,
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
import Collapsible from 'react-native-collapsible';
import Device from 'react-native-device-detection';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

// Component
import AdmobCell from './admob';

const IMAGE_PER_ROW_PHONE = 4;
const IMAGE_PER_ROW_TABLET = 8;

let OFFSETY;
const THRESHOLD = Platform.OS === 'ios' ? 40 : 20;

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
  rollPicker: {
    flex: 2,
  },
  imageBlock: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    resizeMode: 'cover',
  },
  fullPreview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
  markerBlock: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#B366FF',
    width: Device.isTablet ? (Dimensions.get('window').width / IMAGE_PER_ROW_TABLET) - 6 : (Dimensions.get('window').width / IMAGE_PER_ROW_PHONE) - 6,
    height: Device.isTablet ? (Dimensions.get('window').width / IMAGE_PER_ROW_TABLET) - 6 : (Dimensions.get('window').width / IMAGE_PER_ROW_PHONE) - 6,
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
      isModalVisible: false,
      isSelectedShow: true,
    };
  }

  componentDidMount() {
    const that = this;
    store.get('images')
    .then((images) => {
      if (images) {
        that.setState({
          images,
          key0: Math.random(),
          key1: Math.random(),
        });
      }
    });
  }

  onActionSelected(position) {
    if (position === 0 && this.state.images.length > 0) {  // index of 'Clear all'
      this.clearImages();
    } else if (position === 0 && this.state.images.length === 0) {  // index of 'Info'
      Actions.info();
    } else if (position === 1) {  // index of 'Info'
      Actions.info();
    }
  }

  setModalVisible(visible) {
    this.setState({ isModalVisible: visible });
    if (visible) {
      GoogleAnalytics.trackEvent('user-action', 'preview-image');
    }
  }

  getSelectedImages(images, current) {
    console.log(current);
    // console.log(images);
    const tempImages = images.map(item => Object.assign({ photo: item.uri }, item));
    this.setState({ images: tempImages });
    store.save('images', tempImages);
  }

  clearImages() {
    this.setState({
      images: [],
      key0: Math.random(),
    });
    store.save('images', []);
    GoogleAnalytics.trackEvent('user-action', 'clear-images');
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <Collapsible collapsed={!this.state.isSelectedShow} duration={600} collapsedHeight={20}>
          <NavigationBar
            statusBar={{ tintColor: '#212121', style: 'light-content' }}
            style={styles.navigatorBarIOS}
            title={{ title: this.props.title, tintColor: '#F5F5F5' }}
            leftButton={
              <Icon
                style={styles.navigatorLeftButton}
                name="ios-information-circle-outline"
                size={26}
                color="white"
                onPress={Actions.info}
              />
            }
            rightButton={{
              title: this.state.images.length > 0 ? 'Clear all' : '',
              tintColor: '#69BBFF',
              handler: () => this.clearImages(),
            }}
          />
        </Collapsible>
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          iconColor="white"
          actions={
            this.state.images.length > 0 ? [
              { title: 'Clean all', iconName: 'md-trash', iconColor: 'white', show: 'always' },
              { title: 'Info', iconName: 'md-information-circle', iconColor: 'white', show: 'always' },
            ] : [
              { title: 'Info', iconName: 'md-information-circle', iconColor: 'white', show: 'always' },
            ]
          }
          onActionSelected={position => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <TouchableHighlight
            style={styles.fullPreview}
            onPress={() => this.setModalVisible(!this.state.isModalVisible)}
            onPressIn={() => this.setModalVisible(!this.state.isModalVisible)}
          >
            <Image
              style={styles.fullImage}
              source={{ uri: this.state.selectedImage }}
            />
          </TouchableHighlight>
        </Modal>

        <Collapsible style={{ height: 160 }} collapsed={!this.state.isSelectedShow} duration={600}>
          <ScrollView style={styles.preview} horizontal={true}>
            {this.state.images.length > 0 && this.state.images.map((item, i) => <View key={i} style={styles.imageBlock}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(true);
                  this.setState({ selectedImage: item.uri });
                }}
                underlayColor="#424242"
              >
                <Image
                  style={styles.image}
                  source={{ uri: item.uri }}
                />
              </TouchableHighlight>
            </View>)}

            {this.state.images.length === 0 && <View style={{ width: Dimensions.get('window').width - 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>Pick your photos</Text>
            </View>}
          </ScrollView>
        </Collapsible>

        <View style={styles.rollPicker}>
          <CameraRollPicker
            key={this.state.key0}
            callback={(images, current) => this.getSelectedImages(images, current)}
            imagesPerRow={Device.isTablet ? IMAGE_PER_ROW_TABLET : IMAGE_PER_ROW_PHONE}
            backgroundColor="#212121"
            maximum={100}
            selected={this.state.images}
            selectedMarker={<View style={styles.markerBlock}>
              <Image source={require('../assets/checkmark-circle.png')} style={styles.marker} />
            </View>}
            onScroll={(event) => {
              if (event.nativeEvent.contentOffset.y < THRESHOLD) {
                this.setState({ isSelectedShow: true });
              } else if (event.nativeEvent.contentOffset.y - OFFSETY > THRESHOLD) {
                console.log('onScroll UP');
                this.setState({ isSelectedShow: false });
              } else if (OFFSETY - event.nativeEvent.contentOffset.y > THRESHOLD) {
                console.log('onScroll DOWN');
                this.setState({ isSelectedShow: true });
              }
              OFFSETY = event.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={500}
            emptyText="Loading..."
          />
        </View>

        <AdmobCell backgroundColor="#212121" />

        <Collapsible key={this.state.key1} collapsed={this.state.images.length === 0}>
          <TouchableHighlight
            style={styles.footer}
            onPress={() => {
              if (this.state.images.length > 0) {
                if (Platform.OS === 'ios') {
                  Actions.photoBrowser({ images: this.state.images });
                } else if (Platform.OS === 'android') {
                  Actions.password({ images: this.state.images });
                }
                GoogleAnalytics.trackEvent('user-action', 'start-gallery', { label: 'gallery', value: this.state.images.length });
              }
            }}
            underlayColor="#424242"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                style={{ marginRight: 5 }}
                name="ios-paper-plane-outline"
                size={26}
                color="#B366FF"
                onPress={Actions.info}
              />
              <Text style={styles.startText}>Start your Photo Gallery</Text>
            </View>
          </TouchableHighlight>
        </Collapsible>
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
