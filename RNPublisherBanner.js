import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewPropTypes,
} from 'react-native';
import { string, func, arrayOf } from 'prop-types';

import { createErrorFromErrorData } from './utils';

class PublisherBanner extends Component {
  constructor() {
    super();
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);
    this.handleAdFailedToLoad = this.handleAdFailedToLoad.bind(this);
    this.state = {};

    this.timers = [];
    this.timers[0] = Date.now();
    // console.log('PublisherBanner - constructor', this.timers[0]);
  }

  static getDerivedStateFromProps = (props: IProps, state: IState) => {
    return {
      ...state,
      style: {
        width: props.width,
        height: props.height,
      },
    };
  };

  componentDidMount() {
    this.timers[1] = Date.now();
    // console.log('PublisherBanner - componentDidMount', this.timers[1] - this.timers[0]);

    this.loadBanner();
  }

  loadBanner() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._bannerView),
      UIManager.getViewManagerConfig('RNDFPBannerView').Commands.loadBanner,
      null
    );
  }

  handleSizeChange(event) {
    const { height, width } = event.nativeEvent;

    this.timers[3] = Date.now();
    // console.log('PublisherBanner - handleSizeChange', this.timers[3] - this.timers[0]);

    if (height === this.state.style.height && width === this.state.style.width) {
      return;
    }

    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange({ width, height });
    }
  }

  handleAppEvent(event) {
    if (this.props.onAppEvent) {
      const { name, info } = event.nativeEvent;
      this.props.onAppEvent({ name, info });
    }
  }

  handleAdFailedToLoad(event) {
    if (this.props.onAdFailedToLoad) {
      this.props.onAdFailedToLoad(createErrorFromErrorData(event.nativeEvent.error));
    }
  }

  render() {
    this.timers[2] = Date.now();
    // console.log('PublisherBanner - render', this.timers[2] - this.timers[0]);
    return (
      <RNDFPBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onSizeChange={this.handleSizeChange}
        onAdFailedToLoad={this.handleAdFailedToLoad}
        onAppEvent={this.handleAppEvent}
        ref={el => (this._bannerView = el)}
      />
    );
  }
}

PublisherBanner.simulatorId = 'SIMULATOR';

PublisherBanner.propTypes = {
  ...ViewPropTypes,

  /**
   * DFP iOS library banner size constants
   * (https://developers.google.com/admob/ios/banner)
   * banner (320x50, Standard Banner for Phones and Tablets)
   * largeBanner (320x100, Large Banner for Phones and Tablets)
   * mediumRectangle (300x250, IAB Medium Rectangle for Phones and Tablets)
   * fullBanner (468x60, IAB Full-Size Banner for Tablets)
   * leaderboard (728x90, IAB Leaderboard for Tablets)
   * smartBannerPortrait (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
   * smartBannerLandscape (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
   *
   * banner is default
   */
  adSize: string,

  /**
   * Optional array specifying all valid sizes that are appropriate for this slot.
   */
  validAdSizes: arrayOf(string),

  /**
   * DFP ad unit ID
   */
  adUnitID: string,

  /**
   * Array of test devices. Use PublisherBanner.simulatorId for the simulator
   */
  testDevices: arrayOf(string),

  onSizeChange: func,

  /**
   * DFP library events
   */
  onAdLoaded: func,
  onAdFailedToLoad: func,
  onAdOpened: func,
  onAdClosed: func,
  onAdLeftApplication: func,
  onAppEvent: func,
};

const RNDFPBannerView = requireNativeComponent('RNDFPBannerView', PublisherBanner);

export default PublisherBanner;
