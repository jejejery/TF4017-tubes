import Lottie from "lottie-react";
import fanAnimation from "./assets/fan.json";

function FanAnimation({ on = false }) {
  return (
    <div className="flex justify-center items-center">
      <Lottie 
        className="h-[20vh] sm:h-[30vh] md:h-[40vh]" 
        animationData={fanAnimation} 
        loop={on} 
      />
    </div>
  );
}

export default FanAnimation;