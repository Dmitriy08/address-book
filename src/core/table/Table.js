

export default class Table {
  constructor(selector, form, store) {
    this.table = document.querySelector(selector)
    this.table_body = this.table.querySelector('tbody')
    this.form = document.querySelector(form)
    this.store = store
    this.sortFlag = true
    this.init()
  }

  init() {
    this.render()
    this.submitHandler()
    this.eventListeners()
  }

  render() {
    this.table_body.innerHTML = ''
    if (this.store.getFromStore().length) {
      this.store.
          getFromStore().
          forEach((book, index) => this.toHTML(book, index));
    } else {
      this.table_body.innerHTML = `
       <tr class="text-center empty-message">
         <td colspan="5">
              Your Address Book Empty. Please Add Something :)       
          </td>
       </tr>
      `
    }
  }

  toHTML({name, phone, email, address}, index) {
    const row = document.createElement('tr')
    row.setAttribute('data-index', index)
    row.innerHTML = `
        <td data-edit="phone">${phone}</td>
        <td data-edit="name">${name}</td>
        <td data-edit="email">${email}</td>
        <td data-edit="address">${address}</td>
        <td>
            <button data-btn-edit="false" class="btn btn-primary edit_btn">    
                Edit
            </button>
            <button class="btn btn-danger delete_btn">
                Delete
            </button>
         </td>
        `
    this.table_body.appendChild(row)
  }

  submitHandler() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (this.validationForm(this.form)) {
        this.addNewBook(this.form.querySelectorAll('input'));
      }
    })
  }

  addNewBook(inputs) {
    const book = {};
    inputs.forEach(input => {
      const itemType = input.getAttribute('data-input');
      book[itemType] = input.value;
      input.value = ''
    })
    this.store.addToStore(book)
    this.displayMessage(this.form, 'New Item Adding To Address Book', 'success')
    this.render()
  }

  validationForm(form) {
    const phone = form.querySelector('#address_book_phone');
    const name = form.querySelector('#address_book_name');
    const email = form.querySelector('#address_book_email');
    const address = form.querySelector('#address_book_address');

    if (phone.value === '') {
      this.displayMessage(this.form, 'Enter phone', 'danger')
      phone.focus();
      return false;
    }

    if (name.value === '') {
      this.displayMessage(this.form, 'Enter name', 'danger')
      name.focus();
      return false;
    }

    if (email.value === '') {
      this.displayMessage(this.form, 'Enter email', 'danger')
      email.focus();
      return false;
    }

    if (address.value === '') {
      this.displayMessage(this.form, 'Enter address', 'danger')
      address.focus();
      return false;
    }
    return true;
  }

  displayMessage(element, text, className) {
    const message = `
    <div class="alert alert-${className}" role="alert">
      ${text}
    </div>
    `
    element.insertAdjacentHTML('afterbegin', message)
    setTimeout(()=>{
      element.querySelector('.alert').remove()
    }, 2000)
  }

  eventListeners() {
    this.table.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete_btn')) {
        this.onDelete(e.target)
      } else if (e.target.classList.contains('edit_btn')) {
        this.onEdit(e.target)
      } else if (e.target.hasAttribute('data-key')) {
        this.sortItems(e.target)
      }
    })
  }

  onDelete(elem) {
    const index = elem.closest('tr').getAttribute('data-index')
    this.displayMessage(
        this.table,
        `This item was delete from address book`,
        'success'
    )
    this.store.removeFromStore(index)
    this.render()
  }

  onEdit(elem) {
    const index = elem.closest('tr').getAttribute('data-index')
    const row = elem.closest('tr')
    const editElems = row.querySelectorAll('[data-edit]')
    const editBook = {};
    if (elem.getAttribute('data-btn-edit') === 'false') {
      elem.textContent = 'Save';
      elem.dataset.btnEdit = 'true';
      editElems.forEach(elem => {
        elem.contentEditable = 'true'
      })
    } else {
      elem.textContent = 'Edit';
      elem.dataset.btnEdit = 'false';
      editElems.forEach(elem => {
        elem.contentEditable = 'false';
        editBook[elem.dataset.edit] = elem.textContent;
      })
      this.store.updateStore(editBook, index);
      this.render()
    }
  }

  sortItems(elem) {
    const key = elem.getAttribute('data-key');
    this.sortFlag = !this.sortFlag;
    this.sorting(this.store.getFromStore(), key, this.sortFlag)
    this.render();
  }

  sorting(arr, key, flag) {
    arr.sort((a, b) => {
      if (flag) {
        return (a[key] > b[key]) ? 1 : -1;
      }
      return (a[key] > b[key]) ? -1 : 1;
    })
  }
}
