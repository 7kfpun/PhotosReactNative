import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { AdMobBanner } from 'react-native-admob';

import { config } from './config';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

function AdmobCell(props) {
  const adUnitID = Platform.OS === 'ios' ? config.admob.ios.banner : config.admob.android.banner;
  return (
    <View style={[styles.container, { margin: props.margin }]}>
      <AdMobBanner bannerSize={props.bannerSize} adUnitID={adUnitID} />
    </View>
  );
}

AdmobCell.propTypes = {
  margin: React.PropTypes.number,
  bannerSize: React.PropTypes.string,
};

AdmobCell.defaultProps = {
  margin: 0,
  bannerSize: 'smartBannerPortrait',
};

module.exports = AdmobCell;
