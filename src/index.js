import Store from '@core/store/Store';
import Table from '@core/table/Table';
import './scss/index.scss'

document.addEventListener('DOMContentLoaded', () =>{
  'use strict'
  new Table(
      '#address_book_table',
      '#address_book_form',
      new Store()
  );
})
