import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import MailOutline from "@material-ui/icons/MailOutline";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitLinkedin = () => {
    window.location = "https://www.linkedin.com/in/subhanshu-singh-9891382ba/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            {/* <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/tripleayt/image/upload/v1631555947/products/jpyibarlaxawvcvqjv5b.png"
              alt="Founder"
            /> */}
            <Typography>Subhanshu Singh</Typography>
            <Button onClick={visitLinkedin} color="primary">
              Visit Linkedin
            </Button>
            <span>
              This is a sample ecommerce wesbite made by Subhanshu.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Find Us Online</Typography>
            <a
              href="mailto:subhanshu3680@gmail.com"
              target="blank"
            >
              <MailOutline className="mailSvgIcon" />
            </a>

            <a href="https://instagram.com/subhanshu__singh" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
