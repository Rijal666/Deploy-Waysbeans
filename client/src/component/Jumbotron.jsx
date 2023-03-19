// import ImgHero from "../assets/image/Jumbotron.png";

// function Jumbotron() {
//   return (
//     <div className="container mt-5">
//       <img src={ImgHero} style={{ width: "100%" }} alt="jumbotron" />
//     </div>
//   );
// }

// export default Jumbotron;

import React from "react";
import { Col, Container, Image } from "react-bootstrap";
// assets
import '../assets/css/Main.css';
import heroLogo from "../assets/image/IconHero.png";
import iconWaves from "../assets/image/waves.png";
import heroImage from "../assets/image/Hero.png";

export default function HeroSection() {
  return (
    <Container>
      <Col md={10} className="position-relative" style={{ marginLeft: 70, marginTop: 40, backgroundColor: "#DBB699", }}>
        <Col md={8} className="p-5 d-flex flex-column gap-4">
          <Image className="position-relative" src={heroLogo} />
          <h5 className="text-black">BEST QUALITY COFFEE BEANS</h5>
          <p className="text-black">Quality freshly roasted coffee made just for you. 
          <br/> Pour, brew and enjoy</p>
        </Col>
        <Image src={iconWaves} className="waves" style={{ marginLeft: 523, top: 243 }} />
        <Image src={heroImage} className="hero-img img-fluid" style={{ marginLeft: 616, top: 28 }} />
      </Col>
    </Container>
  );
}
