import EventEmitter from 'events'
import * as CSS from 'csstype'
import type { PayComScriptOptions } from './script-options'

type PayCustomPseudos = ':error'

type PayCssConfig = Partial<
  Record<CSS.SimplePseudos | PayCustomPseudos, CSS.Properties>
> &
  CSS.Properties

interface InitData {
  sandbox: boolean
  debug: boolean
}

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

export interface CheckoutToggles {
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
   * If true, won't display required additional fields, such as email for EU  3ds.
   * @default false
   */
  disableAdditionalFields?: boolean
  /**
   * If true, will render native browser checkboxes instead of ours.
   * @default false
   */
  nativeCheckboxes?: boolean
  /**
   * If true, on mobile view all fields will be in one column.
   * @default false
   */
  mobileColumn?: boolean
  /**
   * If true, will render credit card brand on number input
   * @default false
   */
  withCardNumberBrand?: boolean
  /**
   * If true, will render a tooltip on the card CVV input
   * @default false
   */
  withCvvTooltip?: boolean
}

export interface PaypalOpts {
  container: string
  onClickValidation: () => Promise<boolean>
}

export interface RenderOpts {
  container: string
  button?: boolean
  toggles?: CheckoutToggles
  formConfig?: CheckoutFormConfig
  localizations?: {
    [language: string]: LanguageLocalizationOverride
  }
  style?: CheckoutStyles
}

export interface UniversalToggles {
  /**
   * If false, the form will render without a submission button.
   * @default true
   */
  submitButton?: boolean

  /**
   * If false, the default suppoerted brands footer will not appear.
   * @default true
   */
  withCardBrandsFooterLogos?: boolean

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

  /**
   * If true, only user's saved sources will displayed.
   * @default false
   */
  allowOnlyExistingPaymentMethods?: boolean

  /**
   * If true, user will not be able the pay with saved source.
   * @default false
   */
  newCardOnly?: boolean

  /**
   * If true, user will not be able to remove saved source.
   * @default false
   */
  disablePaymentMethodDeletion?: boolean

  /**
   * If true, the submit button will be disabled while form invalid.
   * @default false
   */
  disableSubmitUntilFormIsValid?: boolean
}

export type LanguageLocalizationOverride = {
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

export interface DividerStyles {
  text?: PayCssConfig
  divider?: {
    marginBottom?: PayCssConfig['marginBottom']
    color?: PayCssConfig['color']
    height?: PayCssConfig['height']
    ':disabled'?: {
      color?: PayCssConfig['color']
      height?: PayCssConfig['height']
    }
  }
}

export type ExpandablePaymentMethods = 'upi' | 'netbanking'

export interface ApmStyle {
  divider?: DividerStyles
  input?: PayCssConfig
}

export interface UniversalOpts {
  container: string
  cardForm?: Omit<RenderOpts, 'container' | 'style'>
  toggles?: UniversalToggles
  selectedPaymentMethod?: string
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
    apms?: Partial<Record<ExpandablePaymentMethods, ApmStyle>>
    dividers?: {
      showOtherWaysToPay?: DividerStyles
      payWith?: DividerStyles
      savedPaymentMethods?: DividerStyles
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
    ctp?: CTPStyles
  }
  paymentMethods?: Array<string>
  alternatives?: 'button' | 'radio'
}

export interface SubmitOpts {
  token?: string
}

export type FailureError = {
  message: string
  data?: Record<string, unknown>
}

export type Mode = 'integrated' | 'modal'

export type Locale =
  | 'en-US'
  | 'en-GB'
  | 'ro-RO'
  | 'zh-CN'
  | 'cs-CZ'
  | 'da-DK'
  | 'nl-NL'
  | 'de-DE'
  | 'fr-FR'
  | 'fi-FI'
  | 'el-GR'
  | 'hu-HU'
  | 'id-ID'
  | 'it-IT'
  | 'ja-JP'
  | 'ko-KR'
  | 'ko-KP'
  | 'nb-NO'
  | 'pl-PL'
  | 'pt-PT'
  | 'pt-BR'
  | 'ru-RU'
  | 'es-ES'
  | 'se-SE'
  | 'se-FI'
  | 'se-NO'
  | 'tr-TR'
  | 'vi-VN'

export interface CheckoutOpts {
  /**
   * @deprecated Got replaced by clientSecret
   */
  token?: string | (() => Promise<string>)
  clientSecret?: string | (() => Promise<string>)
  currency?: string
  amount?: string
  onSuccess?: (payment: Record<string, unknown>) => void
  onFailure?: (error: FailureError) => void
  mode?: Mode
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
    whiteLabel?: boolean
    disableSetupFutureUsageCheckbox?: boolean
  }
  locale?: Locale
}

interface PayComI {
  identifier: string
  sandbox: boolean
  debug: boolean
}

interface PayComOpts {
  identifier?: string
  riskIdentifier?: string
  sandbox?: boolean
  debug?: boolean
}

export enum EVENT_TYPES {
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
  MAX_ATTEMPTS_REACHED = 'max_attempts_reached',
  PAYMENT_PENDING_APPROVAL = 'payment_pending_approval',
  SET_DISABLE_UI = 'set_disable_ui',
  HEADLESS_READY = 'headless_ready',
  FORM_VALIDATION_UPDATED = 'form_validation_update'
}

export type ListenerFn = (
  eventName: EVENT_TYPES,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...params: any[]) => void
) => EventEmitter

export type ValidationResponse = {
  valid: boolean
  invalidFields: string[]
}

export enum ELEMENT_TYPES {
  CHECKOUT = 'checkout',
  UNIVERSAL = 'universal',
  PAYPAL = 'paypal'
  // UNIVERSAL_V2 = 'universal-v2'
}

enum TransactionStatusEnum {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  CREATED = 'CREATED'
}

export type SubmitResponse = {
  transactionStatus: TransactionStatusEnum
  transactionId: string
  transactionDateTime: string
  sourceId: string
  consumerId: string
}

export type ValidateResponse = {
  valid: boolean
  invalidFields: string[]
  paymentMethodDetails?: {
    type: string
    card?: {
      bin: string
      last4: string
      name: string
      expirationMonth: string
      expirationYear: string
    }
  }
}

type RenderFn = (renderOpts: RenderOpts) => Promise<void>
type PaypalFn = (paypalOpts: PaypalOpts) => Promise<void>
type BlurFn = () => void
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

type ValidateFn = (
  frameType?: ELEMENT_TYPES
) => Promise<ValidateResponse | void>
type ResetFn = (frameType?: ELEMENT_TYPES) => Promise<void>

export type UpdateTransactionDetailsOpts = {
  successUrl?: string
  failureUrl?: string
  consumer?: {
    firstName?: string
    lastName?: string
    name?: string
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
  customFieldsValues?: Record<string, string | number | boolean>
}

export type PayOpts = {
  source: string
  cvv?: string
}

export type PayFn = (Opts: PayOpts) => Promise<unknown>

export type UpdateTransactionDetailsFn = (
  config: UpdateTransactionDetailsOpts
) => Promise<unknown>

export type ResyncFn = () => Promise<void>

export type AddressType = {
  line1: string
  line2?: string
  city: string
  state?: string
  country: string
  postalCode: string
}

export type HeadlessFn = (
  method: string,
  paymentMethodData?: unknown,
  billingDetails?: AddressType
) => Promise<unknown>

export type CanMakePaymentsFn = () => Promise<unknown>

export type InitHeadlessCtpParams = {
  emailInputRef?: HTMLDivElement | string
  email: string
  containers: {
    mainWidget: HTMLDivElement | string
    linkNewCard: HTMLDivElement | string
  }
  style?: CTPStyles
}

export type CTPStyles = Partial<{
  mainWidgetContainer: PayCssConfig
  linkNewCardContainer: PayCssConfig
}>

export enum CTP_EVENTS {
  VALIDATION_CHANGED = 'validation-changed',
  AUTHENTICATED = 'authenticated'
}

export declare enum CtpCompletePaymentStatus {
  success = 'SUCCESS',
  declined = 'DECLINED'
}

export type CheckoutCTPBillingDetails = {
  address: {
    addressLine: string
    addressLine2?: string
    zip: string
    city: string
    state?: string
    countryAlpha2: string
  }
  name: string
  phone: string
}

export type HeadlessCtpObject = {
  on: Listener<CTP_EVENTS>
  once: Listener<CTP_EVENTS>
  removeListener: Listener<CTP_EVENTS>
  validate: () => Promise<{ valid: boolean }>
  completePayment: (status: CtpCompletePaymentStatus) => Promise<void>
  updateBillingDetails: (
    params: Partial<CheckoutCTPBillingDetails>
  ) => Promise<void>
  STATUS_SUCCESS: CtpCompletePaymentStatus.success
  STATUS_DECLINED: CtpCompletePaymentStatus.declined
}

export type CustomFieldType = 'input' | 'date' | 'checkbox' | 'radio' | 'select'

export type CustomFieldsOptions = {
  label: string
  value: string
}

export type CustomField = {
  id: string
  placeholder?: string
  label?: string
  type?: CustomFieldType
  inputType?: string
  options?: CustomFieldsOptions[]
  description?: string
  validation?: CustomFieldsValidation
}

export type CustomFieldsValidation = {
  required?: boolean
  max?: number
  min?: number
  maxLength?: number
  minLength?: number
  pattern?: string
}

export type PaymentMethod = {
  paymentMethodType: string
  name: string
  redirect?: boolean
  fields?: CustomField[]
}

export type ExistingCard = {
  bin: string
  brand: 'visa' | 'mastercard' | 'amex' | 'discover'
  cardholderCurrency: string
  country: string
  issuerName: string
  expMonth: string
  expYear: string
  last4: string
  fingerprint: string
  funding: 'prepaid' | 'debit' | 'credit'
  network: 'visa' | 'mastercard' | 'amex' | 'discover'
  payout: string
}

export type ExistingSource = {
  id: string
  type: string
  card?: ExistingCard
}

export type CheckoutObject = {
  on: ListenerFn
  once: ListenerFn
  removeListener: ListenerFn
  EVENT_TYPES: typeof EVENT_TYPES
  ELEMENT_TYPES: typeof ELEMENT_TYPES
  render: RenderFn
  paypal: PaypalFn
  universal: UniversalFn
  blur: BlurFn
  update: UpdateFn
  updateTransactionDetails: UpdateTransactionDetailsFn
  submit: SubmitFn
  resync: ResyncFn
  canMakePayments: CanMakePaymentsFn
  validate: ValidateFn
  reset: ResetFn
  pay: PayFn
  headless: HeadlessFn
  ctp: (params: InitHeadlessCtpParams) => Promise<HeadlessCtpObject>
  getPaymentMethods: () => Promise<PaymentMethod[]>
  getExistingSources: () => Promise<ExistingSource[]>
}

export type CheckoutFunction = (opts: CheckoutOpts) => CheckoutObject

export type PayComFunction = (opts: PayComOpts) => Promise<{
  checkout: CheckoutFunction
}>

export interface PayComNamespace {
  com: PayComFunction
  riskIdentifier: string
}

declare module '@pay-com/js' {
  export function loadScript(
    options: PayComScriptOptions,
    PromisePonyfill?: PromiseConstructor
  ): Promise<PayComNamespace>

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
