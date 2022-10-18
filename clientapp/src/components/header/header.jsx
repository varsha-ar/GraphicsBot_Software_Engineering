import * as React from 'react';
import "./header.css";
import gitLogo from '../../assets/githubLogo.png';
import jLogo from '../../assets/logo.svg';

export class Header extends React.Component {
    render() {
        return (<header className='flex-h'>
            <div><img src={gitLogo} alt="Logo" className='logo-size'/></div>
            <div className='title'><span>GitHub Insights and Analytics</span></div>
            <div><img src={jLogo} alt="jLogo" className='logo-size'/></div>
        </header>);
    }
}