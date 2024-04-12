import {EventEmitter} from "events";
import net from "net"

export class MessageEventEmiter extends EventEmitter {
  constructor() {
    super();
    net.createServer((connection) => {
      connection.on("data", (dataChunk) => {
        let fullData = "";
        fullData += dataChunk;
        let finish = fullData.indexOf("\n");
        while (finish !== -1) {
          const message = fullData.substring(0, finish);
          fullData = fullData.substring(finish + 1);
          this.emit("message", JSON.parse(message.toString()), connection);
          finish = fullData.indexOf("\n");
        }
      });
    }).listen(60300);
  }
}