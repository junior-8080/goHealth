import React from 'react';
import * as func from '../utils/functions';
// import { FormattedMessage } from 'react-intl';

const Footer = props => {

    return (
       <React.Fragment>
            <footer className="footer">
                <div className="d-sm-flex justify-content-center justify-content-sm-between">
                    <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2020-{func.dates.yr} &nbsp; <a href="https://anchoratechs.com" target="_blank" rel="noopener noreferrer">Anchora Technologies</a>.</span>
                    <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted &amp; made with <i className="mdi mdi-heart text-danger"></i></span>
                </div>
            </footer>
       </React.Fragment>
    );

};

export default Footer;