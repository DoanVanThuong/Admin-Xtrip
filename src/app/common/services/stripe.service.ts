import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {Script} from "./script.service";

declare var Stripe: any;

// Use the token to create a charge or a customer
// https://stripe.com/docs/charges
// https://stripe.com/docs/stripe.js?

export interface BankAccountInterface {
  country: string,              // us
  currency: string,             // usd
  routing_number: string,
  account_number: string,
  account_holder_name?: string,
  account_holder_type?: string,
}

export interface CardDataInterface {
  name?: string,            // Cardholder name
  address_line1?: string,   // Billing address information
  address_line2?: string,
  address_city?: string,
  address_state?: string,
  address_zip?: string,
  address_country?: string, // Currently, the only supported currency for debit card transfers is usd.
}

@Injectable()
export class StripeService {
  stripe: any;
  loaded: boolean = false;

  constructor(script: Script) {
    script.load('Stripe').then(() => {
      this.stripe = Stripe(environment.STRIPE.API_KEY);
      this.loaded = true;
    }).catch(error => console.log(error));
  }

  /***
   * Create cart form
   *
   * @param elementId
   * @param callback
   * @returns {any}
   *
   *  let timer;
   *  timer = setInterval(() => {
   *     if (this._stripe.loaded) {
   *       this.card = this._stripe.createCard('#card-element', (event: any) => {
   *         this.cardInfo = event;
   *       });
   *       clearInterval(timer);
   *     }
   *   }, 200);
   */
  createCard(elementId: string, callback: any) {
    let elements = this.stripe.elements();
    let card = elements.create('card', {
      // classes: {
      //   base: "stripe_card",
      //   complete: "stripe_card--complete",
      //   empty: "stripe_card--empty",
      //   focus: "stripe_card--focus",
      //   invalid: "stripe_card--invalid",
      //   webkitAutofill: "stripe_card--webkit-autofill",
      // },
      hidePostalCode: true,
      hideIcon: false,
      style: {
        base: {
          color: '#747f91',
          fontSize: '16px',
          lineHeight: '45px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#99999',
          },
        },
        invalid: {
          color: '#d0021b',
          ':focus': {
            color: '#747f91',
          },
        },

      }
    });

    card.mount(elementId);

    card.on('change', function (event) {
      callback(event);
    });

    return card;
  }

  createTokenCard(card: any, cardData: CardDataInterface) {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        reject(false);
      } else {
        this.stripe.createToken(card, cardData).then(result => {
          if (result.token) {
            resolve(result.token);
          } else if (result.error) {
            reject(result.error);
          }
        });
      }
    });
  }

  createTokenBankAccount(bankAccountData: BankAccountInterface) {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        reject(false);
      } else {
        this.stripe.createToken('bank_account', bankAccountData).then(result => {
          if (result.token) {
            resolve(result.token);
          } else if (result.error) {
            reject(result.error);
          }
        });
      }
    });
  }

  createTokenPII(personalIdNumber: string) {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        reject(false);
      } else {
        this.stripe.createToken('pii', {
          personal_id_number: personalIdNumber,
        }).then(result => {
          if (result.token) {
            resolve(result.token);
          } else if (result.error) {
            reject(false);
          }
        });
      }
    });
  }
}
