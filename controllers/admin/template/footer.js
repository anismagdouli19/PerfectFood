import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class FooterTemplate1 extends Component {


  render() {
    const d = new Date();
    const year = d.getFullYear();

    return (
      <footer id="footer">
  
</footer>
    );
  }
}


export default FooterTemplate1;
