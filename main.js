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
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import NavigationBar from 'react-native-navbar';

import _ from 'underscore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorBarIOS: {
    backgroundColor: '#F5F5F5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageTouch: {
    width: (Dimensions.get('window').width / 4) - 1.5,
    height: (Dimensions.get('window').width / 4) - 1.5,
    margin: 0.5,
  },
  image: {
    width: (Dimensions.get('window').width / 4) - 1.5,
    height: (Dimensions.get('window').width / 4) - 1.5,
    resizeMode: 'cover',
    margin: 0.5,
  },
  addBlock: {
    backgroundColor: '#EEEEEE',
    borderColor: '#CCCCCC',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  selectedImage: {
    borderWidth: StyleSheet.hairlineWidth * 5,
    borderColor: '#9C27B0',
  },
  footer: {
    height: 55,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DBDBDB',
  },
  text: {
    fontSize: 12,
    color: '#1A1A1A',
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
      selectedImage: {},
    };
  }

  pickPhotos() {
    ImagePicker.openPicker({
      multiple: true,
    }).then((images) => {
      console.log(images);
      let mergedImages = this.state.images.concat(images.map((item) => Object.assign({ photo: item.path }, item)));
      mergedImages = _.uniq(mergedImages, false);
      this.setState({
        images: mergedImages,
      });
    });
  }

  deleteSelectedImage() {
    const that = this;
    if (!_.isEmpty(this.state.selectedImage)) {
      const imagesRemoved = this.state.images.filter((item) => item.path !== that.state.selectedImage.path);
      this.setState({
        images: imagesRemoved,
        selectedImage: {},
      });
    }
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#F5F5F5', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#1A1A1A' }}
          rightButton={_.isEmpty(this.state.selectedImage) ? <Icon
            style={styles.navigatorRightButton}
            name="ios-trash-outline"
            size={0}
            color="white"
          /> : <Icon
            style={styles.navigatorRightButton}
            name="ios-trash-outline"
            size={24}
            color="#9C27B0"
            onPress={() => this.deleteSelectedImage()}
          />}
        />
      );
    }
  }

  render() {
    const that = this;
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView>
          <View style={styles.imageBlock}>
            {this.state.images.map((item, i) => <TouchableHighlight
              key={i}
              style={styles.imageTouch}
              onPress={() => that.setState({ selectedImage: that.state.selectedImage !== item ? item : {} })}
              underlayColor="white"
            >
              <Image
                style={[styles.image, _.isEqual(that.state.selectedImage, item) ? styles.selectedImage : null]}
                source={{ uri: item.path }}
              />
            </TouchableHighlight>
            )}

            <TouchableHighlight onPress={() => this.pickPhotos()} underlayColor="white">
              <View style={[styles.imageTouch, styles.addBlock]}>
                <Icon name="ios-add-circle-outline" size={32} color="#808080" />
                <Text style={[styles.text, { color: '#808080' }]}>Add</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>

        <TouchableHighlight
          style={styles.footer}
          onPress={() => {
            if (this.state.images.length > 0) {
              Actions.photoBrowser({ images: this.state.images });
            }
          }}
          underlayColor="white"
        >
          <Text style={styles.startText}>Go!</Text>
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
