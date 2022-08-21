/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PageViewElement } from './page-view-element.js';
import { html } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { shopButtonStyle } from './shop-button-style.js';
import { shopCheckboxStyle } from'./shop-checkbox-style.js';
import { shopCommonStyle } from './shop-common-style.js';
import { shopFormStyle } from './shop-form-style.js';
import { shopInputStyle } from'./shop-input-style.js';
import { shopSelectStyle } from './shop-select-style.js';

import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { totalSelector } from '../reducers/cart.js';
import { updateCheckoutState } from '../actions/checkout.js';
import { clearCart } from '../actions/cart.js';
import { announceLabel } from '../actions/app.js';
import checkout from '../reducers/checkout.js';
import '@jcshop/jc-checkout/jc-checkout.js';

store.addReducers({
  checkout
});

class ShopCheckout extends connect(store)(PageViewElement) {
  render() {
    const cart = this._cart;
    const cartList = cart ? Object.keys(cart).map(key => cart[key]) : [];

    return html`
    ${shopButtonStyle}
    ${shopCheckboxStyle}
    ${shopCommonStyle}
    ${shopFormStyle}
    ${shopInputStyle}
    ${shopSelectStyle}
    <style>

      .main-frame {
        transition: opacity 0.5s;
      }

      .main-frame.waiting {
        opacity: 0.1;
      }

      shop-input, shop-select {
        font-size: 16px;
      }

      shop-select {
        margin-bottom: 20px;
      }

      paper-spinner-lite {
        position: fixed;
        top: calc(50% - 14px);
        left: calc(50% - 14px);
      }

      .billing-address-picker {
        margin: 28px 0;
        height: 20px;
        display: flex;
      }

      .billing-address-picker > label {
        margin-left: 12px;
      }

      .grid {
        margin-top: 40px;
        display: flex;
      }

      .grid > section {
        flex: 1;
      }

      .grid > section:not(:first-child) {
        margin-left: 80px;
      }

      .row {
        display: flex;
        align-items: flex-end;
      }

      .column {
        display: flex;
        flex-direction: column;
      }

      .row > .flex,
      .input-row > * {
        flex: 1;
      }

      .input-row > *:not(:first-child) {
        margin-left: 8px;
      }

      .shop-select-label {
        line-height: 20px;
      }

      .order-summary-row {
        line-height: 24px;
      }

      .total-row {
        font-weight: 500;
        margin: 30px 0;
      }

      @media (max-width: 767px) {

        .grid {
          display: block;
          margin-top: 0;
        }

        .grid > section:not(:first-child) {
          margin-left: 0;
        }

      }

    </style>

    <div class="${this._waiting ? 'main-frame waiting' : 'main-frame'}">
      ${this._state === 'init' ? html`
        <div state="init">
          <form id="checkoutForm">
            ${cartList.length === 0 ? html`
              <div class="subsection">
                <p class="empty-cart">Your <iron-icon icon="shopping-cart"></iron-icon> is empty.</p>
              </div>` : html`
              <header class="subsection">
                <h1>Checkout</h1>
                <span>Shop is a demo app - form data will not be sent</span>
              </header>

              <div class="subsection grid">
                <section>
                  <h2 id="accountInfoHeading">Account Information</h2>
                  <div class="row input-row">
                    <shop-input>
                      <input type="email" id="accountEmail" name="accountEmail"
                          placeholder="Email" autofocus required
                          aria-labelledby="accountEmailLabel accountInfoHeading">
                      <shop-md-decorator error-message="Invalid Email" aria-hidden="true">
                        <label id="accountEmailLabel">Email</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <div class="row input-row">
                    <shop-input>
                      <input type="tel" id="accountPhone" name="accountPhone" pattern="\\d{10,}"
                          placeholder="Phone Number" required
                          aria-labelledby="accountPhoneLabel accountInfoHeading">
                      <shop-md-decorator error-message="Invalid Phone Number" aria-hidden="true">
                        <label id="accountPhoneLabel">Phone Number</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <h2 id="shipAddressHeading">Shipping Address</h2>
                  <div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipAddress" name="shipAddress" pattern=".{5,}"
                          placeholder="Address" required
                          aria-labelledby="shipAddressLabel shipAddressHeading">
                      <shop-md-decorator error-message="Invalid Address" aria-hidden="true">
                        <label id="shipAddressLabel">Address</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipCity" name="shipCity" pattern=".{2,}"
                          placeholder="City" required
                          aria-labelledby="shipCityLabel shipAddressHeading">
                      <shop-md-decorator error-message="Invalid City" aria-hidden="true">
                        <label id="shipCityLabel">City</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <div class="row input-row">
                    <shop-input>
                      <input type="text" id="shipState" name="shipState" pattern=".{2,}"
                          placeholder="State/Province" required
                          aria-labelledby="shipStateLabel shipAddressHeading">
                      <shop-md-decorator error-message="Invalid State/Province" aria-hidden="true">
                        <label id="shipStateLabel">State/Province</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                    <shop-input>
                      <input type="text" id="shipZip" name="shipZip" pattern=".{4,}"
                          placeholder="Zip/Postal Code" required
                          aria-labelledby="shipZipLabel shipAddressHeading">
                      <shop-md-decorator error-message="Invalid Zip/Postal Code" aria-hidden="true">
                        <label id="shipZipLabel">Zip/Postal Code</label>
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-input>
                  </div>
                  <div class="column">
                    <label id="shipCountryLabel" class="shop-select-label">Country</label>
                    <shop-select>
                      <select id="shipCountry" name="shipCountry" required
                          aria-labelledby="shipCountryLabel shipAddressHeading">
                        <option value="Brazil">Brazil</option>
                        <option value="Canada">Canada</option>
                        <option value="Indonesia" selected>Indonesia</option>
                        <option value="United States">United States</option>
                      </select>
                      <shop-md-decorator aria-hidden="true">
                        <shop-underline></shop-underline>
                      </shop-md-decorator>
                    </shop-select>
                  </div>
                </section>

                <section>
                  <h2>Order Summary</h2>
                  ${repeat(cartList, entry => html`
                    <div class="row order-summary-row">
                      <div class="flex">${entry.item.title}</div>
                      <div>$${(entry.quantity * entry.item.price).toFixed(2)}</div>
                    </div>
                  `)}
                  <div class="row total-row">
                    <div class="flex">Total</div>
                    <div>$${this._total.toFixed(2)}</div>
                  </div>
                  ${this.systemReady ?
                    html`
                      <shop-button responsive id="submitBox">
                        <input type="button" @click="${this._submit}" value="Place Order">
                      </shop-button>
                    ` :
                    html`Preparing checkout system...`
                  }
                </section>
                <jc-checkout 
                  @dbReady=${()=>this.systemReady=true}
                  @checkoutResponse=${this.checkoutResponse}>
                </jc-checkout>
              </div>
            `}
          </form>
        </div>
      ` : this._state === 'success' ? html`
        <!-- Success message UI -->
        <header state="success">
          <h1>Thank you</h1>
          <p>${this._response.successMessage}</p>
          <shop-button responsive>
            <a href="/">Finish</a>
          </shop-button>
        </header>` : html`
        <!-- Error message UI -->
        <header state="error">
          <h1>We couldn't process your order</h1>
          <p id="errorMessage">${this._response.errorMessage}</p>
          <shop-button responsive>
            <input type="button" @click="${this._resetCheckoutForm}" value="Try Again">
          </shop-button>
        </header>
      `}
    </div>

    <!-- Show spinner when waiting for the server to repond -->
    <paper-spinner-lite ?active="${this._waiting}"></paper-spinner-lite>`;
  }

  get jcCheckout() {
    return this.shadowRoot.querySelector("jc-checkout");
  }

  static get properties() { return {

    /**
     * The total price of the contents in the user's cart.
     */
    _total: { type: Number },

    /**
     * The state of the form. Valid values are:
     * `init`, `success` and `error`.
     */
    _state: { type: String },

    /**
     * The cart contents.
     */
    _cart: { type: Object },

    /**
     * The server's response.
     */
    _response: { type: Object },

    /**
     * If true, the user must enter a billing address.
     */
    _hasBillingAddress: { type: Boolean },

    /**
     * True when waiting for the server to repond.
     */
    _waiting: { type: Boolean },
    systemReady: { type: Boolean }

  }}

  stateChanged(state) {
    this._cart = state.cart;
    this._total = totalSelector(state);
    this._state = state.checkout.state;
    if (state.app.auth) {
      fetch("/src/jc-checkout.json").then(response => { // load the file data
        return response.json()
      }).then(json => {
        this.jcCheckout.setLocalConfig(json.prefix, json.region, true);
      }).catch(e => {
        console.log("ERROR : ", e)
        return e
      })
    }
  }

  checkoutResponse(e) {
    if (e.detail.orderNo) {
      this._didReceiveResponse({
        "success": 1,
        "successMessage": `Your order id: ${e.detail.orderNo} has been received.`
      });
    } else {
      this._didReceiveResponse({
        "error": 1,
        "errorMessage": "Transaction failed."
      });
    }
  }

  _submit() {
    const checkoutForm = this.shadowRoot.querySelector('#checkoutForm');
    if (this._validateForm(checkoutForm)) {
      const accountData = {};
      for (let el, i = 0; el = checkoutForm.elements[i], i < checkoutForm.elements.length; i++) {
        if (el.name) {
          accountData[el.name] = el.value;
        }
      }
      const cart = [];
      for (let [key] of Object.entries(this._cart)) {
        const item = {
          qty: this._cart[key].quantity,
          size: this._cart[key].size
        }
        for (let [k, v] of Object.entries(this._cart[key].item)) {
          if (k == "price" || k == "title") {
            item[k] = v;
          }
        }
        cart.push(item)
      }
      this.jcCheckout.data = {accountData, cart};
    }
  }

  /**
   * Validates the form's inputs and adds the `aria-invalid` attribute to the inputs
   * that don't match the pattern specified in the markup.
   */
  _validateForm(form) {
    let firstInvalid = false;

    for (let el, i = 0; el = form.elements[i], i < form.elements.length; i++) {
      if (el.checkValidity()) {
        el.removeAttribute('aria-invalid');
      } else {
        if (!firstInvalid) {
          // announce error message
          if (el.nextElementSibling) {
            store.dispatch(announceLabel(el.nextElementSibling.getAttribute('error-message')));
          }
          if (el.scrollIntoViewIfNeeded) {
            // safari, chrome
            el.scrollIntoViewIfNeeded();
          } else {
            // firefox, edge, ie
            el.scrollIntoView(false);
          }
          el.focus();
          firstInvalid = true;
        }
        el.setAttribute('aria-invalid', 'true');
      }
    }
    return !firstInvalid;
  }

  /**
   * Sends form and cart data to the server and updates the UI to reflect
   * the waiting state.
   */
  _sendRequest(form) {
    this._waiting = true;

    return fetch('/data/sample_success_response.json', {
      method: 'POST',
      body: JSON.stringify({
        /**
         * NOTE: For demo purposes, form fields here are not sent to the
         * server to avoid unintentionally capturing private data.
         */
        // ccExpMonth: form.elements.ccExpMonth.value,
        // ccExpYear: form.elements.ccExpYear.value,
        // ...
        cart: Object.keys(this._cart).map(key => {
          const entry = this._cart[key];
          return {
            ...entry,
            item: entry.item.name
          }
        })
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Handles the response from the server by checking the response status
   * and transitioning to the success or error UI.
   */
  _didReceiveResponse(response) {
    this._response = response;
    this._waiting = false;

    if (response.success) {
      store.dispatch(updateCheckoutState('success'));
      store.dispatch(clearCart());
    } else {
      store.dispatch(updateCheckoutState('error'));
    }
  }

  _toggleBillingAddress(e) {
    this._hasBillingAddress = e.target.checked;

    if (this._hasBillingAddress) {
      this.updateComplete.then(() => {
        this.shadowRoot.querySelector('#billAddress').focus();
      });
    }
  }

  _resetCheckoutForm() {
    store.dispatch(updateCheckoutState('init'));
  }

}

customElements.define('shop-checkout', ShopCheckout);
