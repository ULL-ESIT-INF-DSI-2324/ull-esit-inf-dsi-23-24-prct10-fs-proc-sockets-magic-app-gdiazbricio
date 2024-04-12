import { MessageEventEmiter } from "./MessageEventEmitter.js"
import { Card } from "./Card.js";
import { CardCollection } from "./CardCollection.js";
import { AddCard } from "./AddCard.js";
import { ModifyCard } from "./ModifyCard.js";
import { ShowCard } from "./ShowCard.js";
import { DeleteCard } from "./DeleteCard.js";
import { ListCards } from "./ListCards.js";

const server = new MessageEventEmiter();

// Se maneja la emision del evento message, procesando la petición del cliente.
server.on("message", (message, connection) => {
  if (message.operation === "add") {
    const myCollection = new CardCollection(message.user);
    const myCard: Card = {
      id: message.id,
      name: message.name,
      mana: message.mana,
      color: message.color,
      typeLine: message.typeLine,
      oddity: message.oddity,
      rules: message.rules,
      strength: message.strength,
      endurance: message.endurance,
      marketValue: message.marketValue
    }
    myCollection.read((err) => {
      if (err) {
        connection.write(JSON.stringify({"result": "error", "message": err}));
        connection.destroy();
      }
      else {
        const myAdder = new AddCard(myCollection);
        myAdder.add(myCard, (err, data) => {
          if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
          else if (data) connection.write(JSON.stringify({"result": "success", "message": data}));
          connection.destroy();
        });
      }
    });
  }

  else if (message.operation === "list") {
    const myCollection = new CardCollection(message.user);
    myCollection.read((err) => {
      if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
      else {
        const myLister = new ListCards(myCollection);
        myLister.list((err, data) => {
          if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
          else if (data) connection.write(JSON.stringify({"result": "success", "message": data}));
        });
      }
      connection.destroy();
    })
  }

  else if (message.operation === "update") {
    const myCollection = new CardCollection(message.user);
    const myCard: Card = {
      id: message.id,
      name: message.name,
      mana: message.mana,
      color: message.color,
      typeLine: message.typeLine,
      oddity: message.oddity,
      rules: message.rules,
      strength: message.strength,
      endurance: message.endurance,
      marketValue: message.marketValue
    }
    myCollection.read((err) => {
      if (err) {
        connection.write(JSON.stringify({"result": "error", "message": err}));
        connection.destroy();
      } 
      else {
        const myModifier = new ModifyCard(myCollection);
        myModifier.modify(myCard, (err, data) => {
          if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
          else if (data) connection.write(JSON.stringify({"result": "success", "message": data}));
          connection.destroy();
        });
      }
    });
  }

  else if (message.operation === "read") {
    const myCollection = new CardCollection(message.user);
    myCollection.read((err) => {
      if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
      else {
        const myReader = new ShowCard(myCollection);
        myReader.showCard(message.id, (err, data) => {
          if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
          else if (data) connection.write(JSON.stringify({"result": "success", "message": data}));
        });
      }
      connection.destroy();
    })
  }

  else if (message.operation === "remove") {
    const myCollection = new CardCollection(message.user);
    myCollection.read((err) => {
      if (err) {
        connection.write(JSON.stringify({"result": "error", "message": err}));
        connection.destroy();
      }
      else {
        const myRemover = new DeleteCard(myCollection);
        myRemover.delete(message.id, (err, data) => {
          if (err) connection.write(JSON.stringify({"result": "error", "message": err}));
          else if (data) connection.write(JSON.stringify({"result": "success", "message": data}));
          connection.destroy();
        });
      }
    })
  }
});
