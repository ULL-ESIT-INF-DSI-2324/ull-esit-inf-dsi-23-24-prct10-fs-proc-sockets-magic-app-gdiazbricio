import { EventEmitter } from "events";

export class MessageEventEmitter extends EventEmitter {
  constructor(private connection: EventEmitter) {
    super();
    let fullData = "";
    connection.on("data", (dataChunk) => {
      fullData += dataChunk;
      let finish = fullData.indexOf("\n");
      while (finish !== -1) {
        const message = fullData.substring(0, finish);
        fullData = fullData.substring(finish + 1);
        this.emit("message", JSON.parse(message.toString()));
        finish = fullData.indexOf("\n");
      }
    });
  }
}
