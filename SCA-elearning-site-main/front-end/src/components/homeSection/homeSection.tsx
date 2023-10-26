//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./homeSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import SuggestionBox from "../suggestionBox/suggestionBox";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import HomeFilesCard from "../homeFilesCard/homeFilesCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    imgUrls: string[],
    currentImg: number,

    slideShowTimer: NodeJS.Timer
}

interface IProps {
    token: string
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class HomeSection extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        let imgUrls: string[] = [
            "http://www.swakopca.com/templates/yootheme/cache/SCA_FUNWALK13_09_2019_6-e2d31c5d.webp",
            "http://www.swakopca.com/templates/yootheme/cache/SCA_FUNWALK13_09_2019_8-6d3641cb.webp",
            "http://www.swakopca.com/templates/yootheme/cache/SCA_FUNWALK13_09_2019_16-a4655dc9.webp"
        ];

        this.state = {
            imgUrls: imgUrls,
            currentImg: 0,

            slideShowTimer: null
        }
    }


    //--------------------------
    //    COMPONENT DID MOUNT
    //--------------------------

    componentDidMount() {

        //----   CREATE TIMEOUT TO CHANGE SLIDES   ----

        let timerId = setInterval(() => this.changeSlide(1), 5000);
        this.setState({ slideShowTimer: timerId });
    }


    //----------------------------
    //    COMPONENT WILL UNMOUNT
    //----------------------------

    componentWillUnmount() {

        //----   CLEAR SLIDESHOW TIMEOUT   ----

        clearTimeout(this.state.slideShowTimer);

    }


    //----------------------
    //    CHANGE SLIDE
    //----------------------

    changeSlide = (addN: number) => {
        let currentImg = this.state.currentImg + addN;

        if (currentImg >= this.state.imgUrls.length) {
            currentImg = 0;
        }

        if (currentImg < 0) {
            currentImg = this.state.imgUrls.length - 1;
        }

        this.setState({ currentImg: currentImg });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="home-container" className="center flex-column">

                {
                    //----   LOGO   ----
                    <div id="home-logo" className="center">
                        <img src={"http://www.swakopca.com/templates/yootheme/cache/SCALogo150h-b6fc9290.webp"} />
                    </div>
                }

                {
                    //----   VISION, MISSION, FAITH   ----
                    <section className="home-info">
                        <h2>VISION, MISSION, & FAITH</h2>
                        <p className="center">
                            Our visioin is to train up a child in the way he should go and when he is old he will not depart from it. We empower our students with everything necessary and inspire one another to take thoughtful action.
                            Our mission is to provide excellence in education through a caring and diverse environment that encourages the holistic development of each student as part of our mandate. We prepare students with the means to succeed in a challenging world.
                            The school will continuously strive to build up the [v]Body of our Lord Jesus Christ and to do whatever it takes to achieve this objective.
                        </p>
                    </section>
                }

                {
                    //----   OUR STUDENTS   ----
                    <section className="home-info">
                        <h2>Our Students</h2>
                        <p className="center">
                            Student empowerment is built on child-centered learning, valuing the student voice and giving them choices about how and what they learn. Inspiration is a wonderful aspiration to make the process of learning fun and exciting. As a result of the new knowledge and understanding our students acquire we want them to apply this learning to the real world.
                        </p>
                    </section>
                }

                {
                    //----   GALLERY   ----
                    <div id="home-gallery-container" className="center">

                        <div className="flex-row" style={{ left: 0 }} onClick={() => this.changeSlide(-1)}>
                            <ArrowBack style={{ transform: "scale(1.3)" }} />
                        </div>

                        <img src={this.state.imgUrls[this.state.currentImg]} width={"100%"} />

                        <div className="flex-row" style={{ right: 0 }} onClick={() => this.changeSlide(1)}>
                            <ArrowForward style={{ transform: "scale(1.3)" }} />
                        </div>

                    </div>
                }


                <h2 id="home-docs-header">Important Documents</h2>
                {
                    //----   DOCUMENTS   ----
                    <div id="home-doc-container" className="center">
                        <HomeFilesCard token={this.props.token} sectionName={"Covid Info"} linkType={5} />
                        <HomeFilesCard token={this.props.token} sectionName={"Announcements"} linkType={6} />
                        <HomeFilesCard token={this.props.token} sectionName={"Rules & Regulations"} linkType={7} />
                    </div>
                }

            </div>
        );
    }
}

export default HomeSection;
