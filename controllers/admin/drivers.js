import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import axios from 'axios';
import {getDriver} from '../../actions/settings';
import { connect} from 'react-redux';

class Driver extends Component {
  componentDidMount() {
    this.props.getDriver().then(
      (response) => {
        //    console.log(response.settings[0].header);
        // const SocialLinks = response.settings;
        // this.setState({
        //   SocialLinks: response.settings
        // })
        var initData = {
          // "header": response.settings[0].header,
          // "sub_header": response.settings[0].sub_header,
          // "instagram": response.settings[0].instagram,
          // "facebook": response.settings[0].facebook,
          // "twitter": response.settings[0].twitter,
          // "linkedin": response.settings[0].linkedin,
          // "youtube": response.settings[0].youtube,
          // "copyright": response.settings[0].copyright,
        };
        //this.props.initialize(initData);
      },
      (err) => err.response.json().then(({
        errors
      }) => {
        console.log('**** get user reviews error ****' + JSON.stringify(errors));
      })
    )
  }
  render() {
    return (
      <div className="driveruser">
       Driver
      </div>
    );
  }
}

export default connect(null, { getDriver })((Driver));
