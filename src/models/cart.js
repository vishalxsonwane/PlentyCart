// models/cart.js
class Cart {
    constructor(oldItems) {
      this.items = oldItems || {};
      this.totalQuantity = 0;
      this.totalPrice = 0;
      this.updateTotals();
    }
  
    add(product, productId, quantity = 1) {
      let storedItem = this.items[productId];
      if (!storedItem) {
        storedItem = this.items[productId] = {
          item: product,
          quantity: 0,
          price: 0
        };
      }
      storedItem.quantity += quantity;
      storedItem.price = storedItem.item.price * storedItem.quantity;
      this.updateTotals();
    }
  
    updateQuantity(productId, quantity) {
      const storedItem = this.items[productId];
      if (storedItem) {
        storedItem.quantity = quantity;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.updateTotals();
      }
    }
  
    removeItem(productId) {
      delete this.items[productId];
      this.updateTotals();
    }
  
    updateTotals() {
      this.totalQuantity = 0;
      this.totalPrice = 0;
      for (let id in this.items) {
        this.totalQuantity += this.items[id].quantity;
        this.totalPrice += this.items[id].price;
      }
    }
  
    lookupItems() {
      const items = [];
      for (let id in this.items) {
        items.push({
          id: id,
          title: this.items[id].item.title,
          quantity: this.items[id].quantity,
          price: this.items[id].item.price,
          imagePath: this.items[id].item.imagePath,
          category: this.items[id].item.category
        });
      }
      return items;
    }
  }
  
  module.exports = Cart;