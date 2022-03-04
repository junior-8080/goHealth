import React from 'react';
import { useEffect } from 'react';
import { func } from '../utils';
// import { Modal } from 'antd';

const Header = props => {
  const { _auth: { logg } } = props;

  useEffect(() => {
    window.init();
  }, []);

  const logout = () => {
    props.signOutSuccess();
    // Modal.confirm({
    //   icon: null,
    //   title: 'Ready to Leave?',
    //   content: 'Select "Logout" below if you are ready to end your current session',
    //   centered: true,
    //   onOk() {
    //     props.signOutSuccess();
    //   }
    // });
  }

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
          <i className="fa fa-bars"></i>
        </button>

        {/* <form
          className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group">
            <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
              aria-label="Search" aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm"></i>
              </button>
            </div>
          </div>
        </form> */}

        <ul className="navbar-nav ml-auto">

          {/* <li className="nav-item dropdown no-arrow d-sm-none">
            <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-search fa-fw"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
              aria-labelledby="searchDropdown">
              <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                  <input type="text" className="form-control bg-light border-0 small"
                    placeholder="Search for..." aria-label="Search"
                    aria-describedby="basic-addon2" />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li> */}
          <div className="topbar-divider d-none d-sm-block"></div>

          <li className="nav-item dropdown no-arrow">
            <span className="nav-link dropdown-toggle pointer" id="userDropdown" role="button"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-900 bold">
                {logg.name} <br />
                <span className="small">({(logg.access || { name: 'N/A' }).name})</span>
              </span>
              <img className="img-profile rounded-circle" src={logg.avatar_link} alt={logg.name} onError={func.imgError} />
            </span>
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown">
              {/* <span className="dropdown-item pointer">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </span>
              <span className="dropdown-item pointer">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </span>
              <span className="dropdown-item pointer">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Activity Log
              </span> */}
              {/* <div className="dropdown-divider"></div> */}
              <span onClick={logout} className="dropdown-item pointer">
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </span>
            </div>
          </li>

        </ul>

      </nav>
    </React.Fragment>
  );

};

export default Header;