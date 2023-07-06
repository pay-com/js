import EventEmitter from 'events';
import * as CSS from 'csstype';

interface PayComScriptQueryParameters {
  identifier: string;
  sandbox?: boolean;
  debug?: boolean;
}

interface PayComScriptOptions extends PayComScriptQueryParameters {
  sdkBaseURL?: string;
}

type PayCustomPseudos = ':error'

type PayCssConfig = Partial<
  Record<CSS.SimplePseudos | PayCustomPseudos, CSS.Properties>
> &
  CSS.Properties
interface CheckoutStyles {
  base?: PayCssConfig
  number?: PayCssConfig
  cvv?: PayCssConfig
  expiry?: PayCssConfig
  name?: PayCssConfig
  checkboxes?: {
    buttonBackground?: string
    labelColor?: string
  }
  submit?: PayCssConfig
}

interface CheckoutFieldConfig {
  label?: string
  labelStyle?: PayCssConfig
  errorMessageStyle?: PayCssConfig
  inputSize?: 'small' | 'medium' | 'large'
  placeholder?: string
  style?: PayCssConfig
}

interface CheckoutFormConfig {
  base?: {
    inputSpacing?: string
    formTitle?: string
    titleStyles?: PayCssConfig
    style?: PayCssConfig
  }
  number?: CheckoutFieldConfig
  cvv?: CheckoutFieldConfig
  expiry?: CheckoutFieldConfig
  name?: CheckoutFieldConfig
}

interface CheckoutToggles {
  /**
   * If false, the form will render without a submission button.
   * @default true
   */
  submitButton?: boolean
  /**
   * If false, the form will render without a title.
   * @default true
   */
  withTitle?: boolean
  /**
   * If false, the form will render without a card holder name.
   * @default true
   */
  withCardHolderName?: boolean
  /**
   * If false, the wrapping element of the form will be a div instead of a form.
   * Good for when the form is embedded inside a larger form.
   * @default true
   */
  formWrapper?: boolean
  /**
   * If true, will display save for future use checkbox under the form.
   * @default false
   */
  saveSourceForFutureUseCheckbox?: boolean
  /**
   * If true, will display our accept T&A checkbox under the form.
   * @default false
   */
  acceptTermsAndConditionsCheckbox?: boolean
  /**
   * If true, will render native browser checkboxes instead of ours.
   * @default false
   */
  nativeCheckboxes?: boolean
}

interface PaypalOpts {
  container: string
  onClickValidation: () => Promise<boolean>
}

interface RenderOpts {
  container: string
  button?: boolean
  toggles?: CheckoutToggles
  formConfig?: CheckoutFormConfig
  localizations?: {
    [language: string]: LanguageLocalizationOverride
  }
  style?: CheckoutStyles
}

interface UniversalToggles {
  /**
   * If false, the form will render without a submission button.
   * @default true
   */
  submitButton?: boolean

  /**
   * If true, displays the card bin as well as last 4.
   * @default false
   */
  savedCardsBins?: boolean | 2 | 3 | 4 | 5 | 6

  /**
   * If true, the CVV in saved payment method will be inline
   * @default false
   */
  savedPaymentMethodInlineCvv?: boolean

  /**
   * A title to display above the Universal form.
   */
  title?: string
}

type LanguageLocalizationOverride = {
  cardForm?: {
    nameOnCard?: string
    cardNumber?: string
    cvv?: string
    expiryDate?: string
    title?: string
    checkboxes?: {
      saveCardForFutureUse?: string
      agreeToTermsAndConditions?: string
    }
    submit?: {
      pay?: string
      save_card?: string
      DEPOSIT?: string
    }
  }
  existingSource?: {
    delete?: string
  }
  dividers?: {
    myPaymentMethods?: string
    otherPaymentMethods?: string
    showOtherWaysToPay?: string
    payWithCard?: string
    payWith?: string
    savedPaymentMethods?: string
  }
}

interface DividerStyle {
  text: PayCssConfig
  divider: {
    color: PayCssConfig['color']
    height: PayCssConfig['height']
  }
}

interface UniversalOpts {
  container: string
  cardForm?: Omit<RenderOpts, 'container' | 'style'>
  toggles?: UniversalToggles
  apmsOnClickValidation?: () => Promise<boolean>
  localizations?: {
    [language: string]: LanguageLocalizationOverride
  }
  style?: {
    cardForm?: CheckoutStyles
    base?: PayCssConfig
    submit?: PayCssConfig
    savedPaymentMethods?: PayCssConfig
    expressCheckout?: PayCssConfig
    apmButtons?: PayCssConfig
    dividers?: {
      showOtherWaysToPay?: DividerStyle
      payWith?: DividerStyle
      savedPaymentMethods?: DividerStyle
    }
    existingSource?: {
      deleteText?: PayCssConfig
      cvv?: {
        style?: PayCssConfig
        labelStyle?: PayCssConfig
        errorMessageStyle?: PayCssConfig
      }
      icons?: {
        delete?: PayCssConfig
        confirmDeletion?: PayCssConfig
        cancelDeletion?: PayCssConfig
      }
      base?: PayCssConfig & { ':selected'?: PayCssConfig }
      radioButton?: {
        color?: PayCssConfig['color']
        ':selected'?: {
          color?: PayCssConfig['color']
        }
      }
    }
  }
  paymentMethods?: Array<string>
}

interface SubmitOpts {
  token?: string
}

type FailureError = {
  message: string
  data?: Record<string, unknown>
}

interface CheckoutOpts {
  /**
   * @deprecated Got replaced by clientSecret
   */
  token?: string | (() => Promise<string>)
  clientSecret?: string | (() => Promise<string>)
  currency?: string
  onSuccess?: (payment: Record<string, unknown>) => void
  onFailure?: (error: FailureError) => void
  mode?: modeOpts
  throwOnSubmitFailure?: boolean
  paymentFailurePopupConfig?: {
    sessionExpiredPopupText?: string
    maxAttemptsReachedPopupText?: string
    style?: PayCssConfig
  }
  toggles?: {
    displayFailureMessages: boolean
    displayEndOfSessionFailureMessages?: boolean
    disableAdditionalFields?: boolean
  }
}

interface PayComOpts {
  identifier?: string
  riskIdentifier?: string
  sandbox?: boolean
  debug?: boolean
}

enum EVENT_TYPES {
  THREE_DS_INIT = 'three_ds_init',
  THREE_DS_CHALLENGE = 'three_ds_challenge',
  THREE_DS_DONE = 'three_ds_done',
  CONTENT_READY = 'content_ready',
  PAYMENT_SUCCESS = 'payment_success',
  SETUP_SUCCESS = 'setup_success',
  PAYMENT_FAILURE = 'payment_failure',
  SETUP_FAILURE = 'setup_failure',
  PAYMENT_PROCESSING = 'payment_processing',
  SETUP_PROCESSING = 'setup_processing',
  SESSION_EXPIRED = 'session_expired',
  MAX_ATTEMPTS_REACHED = 'max_attempts_reached'
}

type ListenerFn = (
  eventName: EVENT_TYPES,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...params: any[]) => void
) => EventEmitter

enum ELEMENT_TYPES {
  CHECKOUT = 'checkout',
  UNIVERSAL = 'universal',
  PAYPAL = 'paypal'
}

type FormattedErrors = {
  valid: boolean
  invalidFields: string[]
}
type RenderFn = (renderOpts: RenderOpts) => Promise<void>
type PaypalFn = (paypalOpts: PaypalOpts) => Promise<void>
type UniversalFn = (universalOpts: UniversalOpts) => Promise<void>
type SubmitFn = (
  opts?: SubmitOpts,
  frameType?: ELEMENT_TYPES
) => Promise<void | Record<string, unknown>>

interface UpdateOpts {
  amount: number
  currency?: string
}
type UpdateFn = (updateOpts: UpdateOpts) => Promise<void>

type ValidateFn = (frameType?: ELEMENT_TYPES) => Promise<FormattedErrors | void>
type ResetFn = (frameType?: ELEMENT_TYPES) => Promise<void>

type UpdateTransactionDetailsOpts = {
  consumer?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  billing?: {
    addressLine: string
    addressLine2?: string
    zip: string
    city: string
    state?: string
    countryAlpha2: string
  }
  shipping?: {
    addressLine: string
    addressLine2?: string
    zip: string
    city: string
    state?: string
    countryAlpha2: string
  }
}

type PayOpts = {
  source: string
}

type PayFn = (Opts: PayOpts) => Promise<unknown>

type UpdateTransactionDetailsFn = (
  config: UpdateTransactionDetailsOpts
) => Promise<unknown>

type CheckoutObject = {
  on: ListenerFn
  once: ListenerFn
  removeListener: ListenerFn
  EVENT_TYPES: typeof EVENT_TYPES
  render: RenderFn
  paypal: PaypalFn
  universal: UniversalFn
  update: UpdateFn
  updateTransactionDetails: UpdateTransactionDetailsFn
  submit: SubmitFn
  validate: ValidateFn
  reset: ResetFn
  pay: PayFn
}

type CheckoutFunction = (opts: CheckoutOpts) => CheckoutObject

type PayComFunction = (opts: PayComOpts) => Promise<{
  checkout: CheckoutFunction
}>

interface PayComNamespace {
  com: PayComFunction
  riskIdentifier: string
}

declare module '@pay-com/js' {
  export function loadScript(
    options: PayComScriptOptions,
    PromisePonyfill?: PromiseConstructor
  ): Promise<PayComNamespace | null>

  export function loadCustomScript(options: {
    url: string
    attributes?: Record<string, string>
    PromisePonyfill?: PromiseConstructor
  }): Promise<void>

  export const version: string
}

declare global {
  interface Window {
    Pay?: PayComNamespace
  }
}

declare const _default: {
    com: (options: PayComScriptOptions, PromisePonyfill?: PromiseConstructor) => Promise<{
        checkout: CheckoutFunction;
    }>;
};

export { CheckoutFunction, CheckoutObject, CheckoutToggles, EVENT_TYPES, ListenerFn, PayComFunction, PayComNamespace, PaypalOpts, RenderOpts, SubmitOpts, UniversalOpts, UpdateTransactionDetailsOpts, _default as default };
