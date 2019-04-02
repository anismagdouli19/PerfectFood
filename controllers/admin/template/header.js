import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
/*import $ from 'jquery';*/


class HeaderTemplate extends Component {

  render() {
    return (

    <div id="right-panel" className="right-panel">
        <header id="header" className="header ">

            <div className="header-menu">
                <div className="col-sm-7">

                    <div className="header-left">
                        <button className="search-trigger"><i className="fa fa-search"></i></button>
                        <div className="form-inline">
                            <form className="search-form">
                                <input className="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search" />
                                <button className="search-close" type="submit"><i className="fa fa-close"></i></button>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="col-sm-5">
                    <div className="user-area dropdown float-right">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="user-avatar rounded-circle" src="/images/admin.jpg" alt="User Avatar" />
                        </a>

                        <div className="user-menu dropdown-menu">
                                <a className="nav-link" href="#"><i className="fa fa- user"></i>My Profile</a>

                                <a className="nav-link" href="#"><i className="fa fa- user"></i>Notifications <span className="count">13</span></a>

                                <a className="nav-link" href="#"><i className="fa fa -cog"></i>Settings</a>

                                <a className="nav-link" href="#"><i className="fa fa-power -off"></i>Logout</a>
                        </div>
                    </div>

                    <div className="language-select dropdown" id="language-select">
                        <a className="dropdown-toggle" href="#" data-toggle="dropdown"  id="language" aria-haspopup="true" aria-expanded="true">
                            <i className="flag-icon flag-icon-us"></i>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="language" >
                            <div className="dropdown-item">
                                <span className="flag-icon flag-icon-fr"></span>
                            </div>
                            <div className="dropdown-item">
                                <i className="flag-icon flag-icon-es"></i>
                            </div>
                            <div className="dropdown-item">
                                <i className="flag-icon flag-icon-us"></i>
                            </div>
                            <div className="dropdown-item">
                                <i className="flag-icon flag-icon-it"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </header>



    </div>
    );
  }
}

export default HeaderTemplate;
