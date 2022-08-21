import { html } from 'lit';

import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { setAuth } from '../actions/app.js';
import { AwsAuthorization } from 'https://packages.appycloud.tech/aws-authorization/AwsAuthorization.js';

class ShopLoginButton extends connect(store)(AwsAuthorization) {
  render() {
    return html`
    <style>

      :host {
        display: block;
        position: relative;
        width: 30px;
      }

      img#login {
        width: 30px;
      }

      img#logout {
        width: 30px;
      }

    </style>

    <a href="/" tabindex="-1">
      ${this.auth ?
        html`<img id='logout' src="/images/logout.svg" title="Logout" @click=${this.logout}>` :
        html`<img id='login' src="/images/login.svg" title="Login" @click=${this.login}>`
      }
    </a>`;
  }

  /**
   * Lifecycle called after DOM updated on the first time
   * Pulling the app config and waiting for the sts state
   */
  firstUpdated() {
    super.firstUpdated();
    fetch("/src/config.json").then(response => { // load the file data
      return response.json()
    }).then(json => {
      this.region = json.region;
      this.userPoolName = json.prefix;
      this.clientId = json.clientId;
      this.apiId = json.apiId;
      this.defaultNotif = true;
      this.autoRefreshToken = true;
    }).catch(e => {
      console.log("ERROR : ", e)
      return e
    })
  }

  async authorized() {
    super.authorized();
    store.dispatch(setAuth(true));
  }
}

customElements.define('shop-login-button', ShopLoginButton);
