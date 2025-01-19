import Lottie from "lottie-react";
import thermoAnimation from "./assets/thermometer.json";

function ThermoAnimation() {
  return (
    <div className="flex items-center">
      <Lottie 
        className="h-[5vh] sm:h-[7vh] md:h-[10vh]" 
        animationData={thermoAnimation} 
        loop={true} 
      />
    </div>
  );
}

export default ThermoAnimation;