
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Banner from "../../assets/Image/CarouselBox/Banner.jpeg";
import Banner1 from "../../assets/Image/CarouselBox/Banner1.jpeg";
import Banner2 from "../../assets/Image/CarouselBox/Banner2.jpeg";

function CarouselBox() {

  return (
    <>
            <Carousel  showThumbs={false} showArrows={false} showStatus={false} autoPlay={true} infiniteLoop={true}>
                  <img src={Banner1}/>

                  <img src={Banner2}/>

                  {/* <img src={Banner}/> */}
          </Carousel>
    </>
  )
}

export default CarouselBox
