const AUTONOMOUS_CLEANING = "cap:autonomous-cleaning";
const SPOT_CLEANING = "cap:spot-cleaning";
const VACUUM = "type:miio:vacuum";

// More on https://github.com/marcelrv/XiaomiRobotVacuumProtocol
export default {
    "app_start": AUTONOMOUS_CLEANING,
    "app_stop": AUTONOMOUS_CLEANING,
    "app_pause": AUTONOMOUS_CLEANING,
    "app_charge": AUTONOMOUS_CLEANING,
    "app_spot": SPOT_CLEANING,
    "fanSpeed": VACUUM
};