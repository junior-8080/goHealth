import React from 'react';
import { Link } from 'react-router-dom';
import { func } from '../utils';

const Navigation = props => {
  const path = props.router.location.pathname;
  const root = path.split('/');
  const { _data: { navigation } } = props;

  return (
    <React.Fragment>
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="./">
          <div className="sidebar-brand-icon rotate-n-15s">
            <i className="fas fa-hospital"></i>
          </div>
          <div className="sidebar-brand-text mx-3">GoHealthy</div>
        </a>
        <hr className="sidebar-divider my-0" />
        {navigation.map(nav => (

          nav.subs.length === 0 ?
            func.hasR(nav.code) && (
              <li key={nav.code} className={`nav-item ${root[1] === nav.link ? 'active' : ''}`}>
                <Link className="nav-link" to={`/${nav.link}`}>
                  <i className={nav.icon}></i>
                  <span>{nav.name}</span>
                </Link>
              </li>
            ) : func.hasR(nav.code) && (
              <li key={nav.code} className={`nav-item ${root[1] === nav.link ? 'active' : ''}`}>
                <span className="nav-link collapsed pointer" data-toggle="collapse" data-target={`#${nav.code}`}
                  aria-expanded="true" aria-controls={nav.code}>
                  <i className={nav.icon}></i>
                  <span>{nav.name}</span>
                </span>
                <div id={nav.code} className={`collapse ${root[1] === nav.link ? 'show' : ''}`} aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                  <div className="bg-white py-2 collapse-inner rounded">
                    {/* <h6 className="collapse-header">Custom Components:</h6> */}
                    {nav.subs.map(sub => (
                      func.hasR(sub.code) && (
                        <Link key={sub.code} className={`collapse-item ${root[1] + '/' + root[2] === sub.link ? 'active' : ''}`} to={`/${sub.link}`}>{sub.name}</Link>
                      )
                    ))}
                  </div>
                </div>
              </li>
            )

        ))}

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>
    </React.Fragment >
  );

};

export default Navigation;