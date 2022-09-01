import { message } from "antd";

class Message {
  error(data: string[]) {
    return data.forEach((msg) => message.error(msg));
  }
}

export default new Message();
