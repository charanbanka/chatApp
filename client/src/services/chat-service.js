import config from "../common/config";
import _const from "../common/const";
import ServiceRequest from "../utils/service-request";

export const fetchMessagesByChatId = async (_id) => {
  try {
    let obj = {
      url: `${config.baseurl}/messages/chat/${_id}`,
      method: "GET",
    };
    let resp = await ServiceRequest(obj);

    return resp.data;
  } catch (error) {
    console.log("fetchMessagesByChatId error=>", error);
    return {
      status: _const.SERVICE_FAILURE,
      message: error.message,
    };
  }
};
