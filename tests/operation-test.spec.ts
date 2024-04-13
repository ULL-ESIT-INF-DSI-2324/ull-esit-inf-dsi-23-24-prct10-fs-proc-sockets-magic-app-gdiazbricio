import 'mocha';
import { expect } from 'chai';
import { AddCard } from '../src/operations/AddCard.js';
import { Card, TypeLines, Oddities, Colors } from '../src/Card.js';
import { CardCollection } from '../src/CardCollection.js';
import { DeleteCard } from '../src/operations/DeleteCard.js';
import {ModifyCard} from '../src/operations/ModifyCard.js';
import {ListCards} from '../src/operations/ListCards.js';
import { ShowCard } from '../src/operations/ShowCard.js';

describe('Operations tests', () => {
  const myCollection = new CardCollection("TestUser");

  // Prueba para verificar si se añade una nueva carta correctamente
  it('Should add a new card to the collection', (done) => {
    const addCard = new AddCard(myCollection);
    const newCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };

    addCard.add(newCard, (error, data) => {
      expect(error).to.be.undefined;
      expect(data).to.equal(`La carta se ha añadido a la colección de TestUser`);
      done();
    });
  });

  // Prueba para verificar si se maneja correctamente el error cuando la carta ya existe en la colección
  it('Should handle error when adding a card that already exists', (done) => {
    const addCard = new AddCard(myCollection);
    const existingCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };

    // Simular que la carta ya existe en la colección
    addCard.add(existingCard, (error, data) => {
      expect(error).to.equal('La carta ya existe en la colección');
      expect(data).to.be.undefined;
      done();
    });
  });

  it('Should update a card to the collection', (done) => {
    const newCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };
    myCollection.read((error) => {
      if (!error) {
        const updateCard = new ModifyCard(myCollection);
        updateCard.modify(newCard, (error, data) => {
          expect(error).to.be.undefined;
          expect(data).to.equal(`La carta: 1 ha sido modificada en la colección de TestUser`);
          done();
        });
      }
    });
  });

  it('Should not update a card if its not in the collection', (done) => {
    const myCollection = new CardCollection("TestUser");
    const newCard: Card = {
      id: 4,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };
    myCollection.read((error) => {
      if (!error) {
        const updateCard = new ModifyCard(myCollection);
        updateCard.modify(newCard, (error, data) => {
          expect(error).to.be.equal(`La carta a modificar no fue encontrada`);
          expect(data).to.be.undefined;
          done();
        });
      }
    });
  });

    // Prueba para verificar si se elimina correctamente una carta de la colección
    it('Should list the cards from the collection', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const listCard = new ListCards(myCollection);
          const cardIdToDelete = 1;
          listCard.list((error, data) => {
            expect(error).to.be.undefined;
            expect(data).to.be.deep.equal([{
              id: 1,
              name: 'Test Card',
              mana: 3,
              color: Colors.Blue,
              typeLine: TypeLines.Creature,
              oddity: Oddities.Common,
              rules: 'Test rules',
              marketValue: 10
            }]);
            done();
          });
        }
      });
    });

    it('Should show the card given from the collection', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const showCard = new ShowCard(myCollection);
          const cardIdToShow = 1;
          showCard.showCard(cardIdToShow, (error, data) => {
            expect(error).to.be.undefined;
            expect(data).to.be.deep.equal({
              id: 1,
              name: 'Test Card',
              mana: 3,
              color: Colors.Blue,
              typeLine: TypeLines.Creature,
              oddity: Oddities.Common,
              rules: 'Test rules',
              marketValue: 10
            });
            done();
          });
        }
      });
    });

    it('Should not show the card given from the collection if not existing', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const showCard = new ShowCard(myCollection);
          const cardIdToShow = 999;
          showCard.showCard(cardIdToShow, (error, data) => {
            expect(error).to.be.equal("La carta no fue encontrada");
            expect(data).to.be.be.undefined;
            done();
          });
        }
      });
    });


  // Prueba para verificar si se elimina correctamente una carta de la colección
  it('Should delete a card from the collection', (done) => {
    const myCollection = new CardCollection("TestUser");
    myCollection.read((error) => {
      if (!error) {
        const deleteCard = new DeleteCard(myCollection);
        const cardIdToDelete = 1;
        deleteCard.delete(cardIdToDelete, (error, data) => {
          expect(error).to.be.undefined;
          expect(data).to.equal(`The card ${cardIdToDelete} has been deleted from the collection of ${myCollection.getUser()}`);
          done();
        });
      }
    });
  });

  // Prueba para verificar si se maneja correctamente el error cuando la carta a eliminar no se encuentra en la colección
  it('Should handle error when deleting a card that does not exist', (done) => {
    const myCollection = new CardCollection("TestUser");
    const deleteCard = new DeleteCard(myCollection);
    const cardIdToDelete = 999;

    deleteCard.delete(cardIdToDelete, (error, data) => {
      expect(error).to.equal('The card to delete was not found');
      expect(data).to.be.undefined;
      done();
    });
  });

  it('Should not list the cards from the collection if empty', (done) => {
    const myCollection = new CardCollection("TestUser");
    myCollection.read((error) => {
      if (!error) {
        const listCard = new ListCards(myCollection);
        const cardIdToDelete = 1;
        listCard.list((error, data) => {
          expect(error).to.be.equal("No hay cartas en la colección");
          expect(data).to.be.undefined;
          done();
        });
      }
    });
  });
});

