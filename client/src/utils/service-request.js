import axios from "axios";
import constants from "../common/const";

const ServiceRequest = async (options) => {
  const moduleName = "ServiceRequest";
  try {
    const token = localStorage.getItem("token");
    let headers = {
      "Content-Type": "application/json",
    };
    options.headers = Object.assign(
      {
        "content-type": "application/json",
        token,
      },
      headers,
      {}
    );

    if (!options.method) {
      options.method = "GET";
    }

    return await axios.request(options);
  } catch (error) {
    console.log(`error occured in ${ServiceRequest} =>`, error);
    return {
      data: {
        status: constants.SERVICE_FAILURE,
        message: error.response.data.message || error.message,
      },
    };
  }
};

export default ServiceRequest;
