
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IProps {
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class Footer extends Component<IProps> {

    render() {
        return (
            <div id="footer-container">
                <div>
                    <a href="http://www.swakopca.com/">Copyright Swakop CA</a>
                    <span></span>
                    <a href="https://www.digitalocean.com/">Hosting By DigitalOcean</a>
                </div>

                <h3 id="scroll-to-top-button" onClick={() => {
                    document.getElementById("content-container").scrollTop = 0; // chrome
                }}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzNF5K7raM_4nLUrk5XwcjBzMFRTJ9Ozb9cg&usqp=CAU" /></h3>
            </div >
        );
    }
}

export default Footer;
