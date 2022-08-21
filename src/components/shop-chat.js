import { css } from 'lit';
import { JcChat } from '@jcshop/jc-chat/src/JcChat';

class ShopChat extends JcChat {
  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      main {
        width: 90%;
        overflow: auto;
        height: 290px;
        margin-bottom: 4px;
        background-color: white;
      }

      main p {
        margin: 5px;
        text-align: left;
        cursor: pointer;
      }

      main p.r {
        text-align: right;
      }

      main p span {
        display: block;
        font-size: 12px;
        color: #ccc;
      }

      span[hidden] {
        display: none;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }
}
customElements.define('shop-chat', ShopChat);