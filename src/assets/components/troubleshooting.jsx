import React from 'react';

export class Troubleshooting extends React.Component {
    constructor(){
        super();
        this.state = {
        }
    }

    render() {
        let s = this.state;
        let p = this.props;

        return (
            <div className="troubleshooting-page" >
                <h2>What error are you looking to solve?</h2>
                <div className="search-box">
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Paste your error here..." />
                    </div>
                    <button type="submit" className="btn btn-default">FIND NOW</button>
                </div>
                <h2>See what we found:</h2>
                <div className="error-list">
                    <h3>404 not found</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                    <a>Type something</a>
                </div>
                <div className="error-list">
                    <h3>404 not found</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                    <a>Type something</a>
                </div>
                <div className="error-list">
                    <h3>404 not found</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                    <a>Type something</a>
                </div>
            </div>
        )
    }
}























