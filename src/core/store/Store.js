export default class Store {
  constructor() {
    this.store = localStorage.getItem('books') ?
      JSON.parse(localStorage.getItem('books')) :
      []
  }

  getFromStore() {
    return this.store
  }

  addToStore(newData) {
    const store = this.getFromStore()
    store.push(newData)
    localStorage.setItem('books', JSON.stringify(store))
  }

  removeFromStore(index) {
    const store = this.getFromStore()
    store.splice(index, 1)
    localStorage.setItem('books', JSON.stringify(store))
  }

  updateStore(newData, index) {
    const before = this.store.slice(0, index);
    const after = this.store.slice(+index + 1);
    this.store = [...before, newData, ...after]
    localStorage
        .setItem('books', JSON.stringify(this.store))
  }
}
