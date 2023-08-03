<h1>Pay Components JS Package</h1>

Pay Components are ready-to-use PCI DSS compliant payment fields you can embed into your checkout page through simple code. Your branding and styling remain untouched, and you don't have to worry about storing card data.

## Installation

To include Pay Components in your project, either install it using `npm i @pay-com/js`, or use our CDN:

```html
<script type="text/javascript" src="https://js.pay.com/v1"></script>
```

## Get Started

### Initialize Pay

To initialize Pay, call `Pay.com()` with your unique merchant id:

```javascript
const pay = await Pay.com({ identifier: 'merchant_id' })
```

### Initialize checkout object

In order to be able to start accepting payments, intialize the checkout object:

```javascript
const checkout = pay.checkout({
  clientSecret: 'payment_session_client_secret',
  onSuccess: payment => {
    // Can be used instead of checkout event listeners
  },
  onFailure: error => {
    // Can be used instead of checkout event listeners
  }
})
```

You now have a checkout object with which you can render a payment form, validate it, and subscribe to events.

To subscribe to different events, use the `checkout.on` function:

```javascript
checkout.on(checkout.EVENT_TYPES.PAYMENT_SUCCESS, payment => {
  // Do something on success
})
checkout.on(checkout.EVENT_TYPES.PAYMENT_PROCESSING, () => {
  // Do something on payment processing
})
checkout.on(checkout.EVENT_TYPES.PAYMENT_FAILURE, error => {
  // Do something on error
})
```

### Render Payment Form

In order to render a payment form, create an empty div which the form will be rendered in, e.g.:

```html
<div id="paycom_checkout"></div>
```

Once you have the div, call the `render` function:

```javascript
checkout.universal({
  container: '#paycom_checkout'
})
```

Thats it! You are now ready to securely accept payments in your website.

### Manual validation and submission

If you wish to render the fields without a submission button for more control, you have to pass the `submitButton: false` option to the `toggles` key under the `universal` function:

```javascript
checkout.universal({
  container: '#paycom_checkout',
  toggles: {
    submitButton: false
  }
})
```

Now the form will render without a button. To validate & submit the form, first create a button:

```html
<button id="pay_button">Pay now!</button>
```

Then, create a click listener on the button:

```javascript
document.getElementById('pay_button').addEventListener('click', async () => {
  // Validate all fields before submitting
  const { valid } = checkout.validate()

  // If the payment form is valid, continue with the payment
  if (valid) {
    // Can also get the payment from return value of submit function.
    const payment = await checkout.submit()
  }
})
```
