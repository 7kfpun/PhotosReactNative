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
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

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
    backgroundColor: 'white',
    elevation: 10,
  },
  imageBlock: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').width / 2,
    resizeMode: 'cover',
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
    color: '#9C27B0',
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

  getSelectedImages(images) {
    console.log(images);
    const tempImages = images.map((item) => Object.assign({ photo: item.uri }, item));
    this.setState({ images: tempImages });
    store.save('images', tempImages);
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#212121', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#F5F5F5' }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="#4A4A4A"
          actions={[
            { title: '', iconName: 'timeline', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView style={{ paddingHorizontal: 5, backgroundColor: '#424242' }} horizontal={true}>
          {this.state.images.length > 0 && this.state.images.map((item, i) => <View key={i} style={styles.imageBlock}>
            <Image
              style={styles.image}
              source={{ uri: item.uri || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
            />
          </View>)}

          {this.state.images.length === 0 && <View style={{ width: Dimensions.get('window').width - 10, justifyContent: 'center', alignItems: 'center' }}><Text>Select some photos</Text></View>}
        </ScrollView>

        <CameraRollPicker
          key={this.state.key}
          callback={(images) => this.getSelectedImages(images)}
          imagesPerRow={4}
          backgroundColor="#212121"
        />

        <TouchableHighlight
          style={styles.footer}
          onPress={() => {
            if (this.state.images.length > 0) {
              Actions.photoBrowser({ images: this.state.images });
            }
          }}
          underlayColor="white"
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
