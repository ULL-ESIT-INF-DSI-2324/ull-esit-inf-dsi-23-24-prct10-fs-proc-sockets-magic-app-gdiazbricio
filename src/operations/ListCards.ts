import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";

/**
 * Represents an operation to list cards in a collection.
 */
export class ListCards {
  /**
   * Creates an instance of ListCards.
   * @param Cards The collection of cards to be listed.
   */
  constructor(private Cards: CardCollection) {}

  /**
   * Lists all the cards in the collection with their details.
   */
  list(
    callback: (error: string | undefined, data: Card[] | undefined) => void,
  ): void {
    if (this.Cards.collection.length === 0)
      callback("No hay elementos en la colección", undefined);
    else {
      const cardList: Card[] = [];
      this.Cards.collection.forEach((card) => {
        cardList.push(card);
      });
      callback(undefined, cardList);
    }
  }
}
