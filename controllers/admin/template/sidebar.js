import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';


class Sidebar extends Component {

  render() {
    return (
   <aside id="left-panel" className="left-panel">
        <nav className="navbar navbar-expand-sm navbar-default">

            <div className="navbar-header">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa fa-bars"></i>
                </button>
                <a className="navbar-brand" href="./"><img src="/images/logo.png" alt="Logo" /></a>
                <a className="navbar-brand hidden" href="./"><img src="/images/logo.png" alt="Logo" /></a>
            </div>

            <div id="main-menu" className="main-menu collapse navbar-collapse">
                <ul className="nav navbar-nav">
                    <li className="active">
                        <a href="/admin"> <i className="menu-icon fa fa-dashboard"></i>Dashboard </a>
                    </li>
                    <h3 className="menu-title">Homepage</h3>
                    <li className="menu-item-has-children dropdown">

                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-cog"></i>Settings</a>
                        <ul className="sub-menu children dropdown-menu">
                            <li><i className="fa fa-puzzle-piece"></i><Link to='/admin/settings'>Settings</Link></li>
                        </ul>
                    </li>
                    <li className="menu-item-has-children dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-users"></i>Users</a>
                        <ul className="sub-menu children dropdown-menu">
                            <li><i className="fa fa-table"></i><Link to='/admin/users/personal'>Personal</Link></li>
                            <li><i className="fa fa-table"></i><Link to='/admin/users/company'>Company</Link></li>
                            <li><i className="fa fa-table"></i><Link to='/admin/users/drivers'>Drivers</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to='/admin/users/resturants'> <i className="menu-icon fa fa-cutlery"></i>Resturants </Link>
                    </li>

                    <h3 className="menu-title">Pages</h3>

                    <li>
                        <Link to='/admin/pages/addpage'> <i className="menu-icon fa fa-plus"></i>Add Page </Link>
                        <Link to='/admin/users/resturants'> <i className="menu-icon fa fa-file"></i>All Pages </Link>
                    </li>


                    <h3 className="menu-title">Extras</h3>
                    <li className="menu-item-has-children dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-glass"></i>Pages</a>
                        <ul className="sub-menu children dropdown-menu">
                            <li><i className="menu-icon fa fa-sign-in"></i><a href="page-login.html">Login</a></li>
                            <li><i className="menu-icon fa fa-sign-in"></i><a href="page-register.html">Register</a></li>
                            <li><i className="menu-icon fa fa-paper-plane"></i><a href="pages-forget.html">Forget Pass</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </aside>

)
}
}

export default Sidebar;
