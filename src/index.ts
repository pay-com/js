import {
  attachScriptListeners,
  findScript,
  getDefaultPromiseImplementation,
  insertScriptElement,
  validateArguments
} from './utils'
import {
  CheckoutToggles,
  PaypalOpts,
  RenderOpts,
  UniversalToggles,
  LanguageLocalizationOverride,
  DividerStyles,
  ExpandablePaymentMethods,
  ApmStyle,
  UniversalOpts,
  SubmitOpts,
  FailureError,
  CheckoutOpts,
  EVENT_TYPES,
  ListenerFn,
  ValidationResponse,
  ELEMENT_TYPES,
  SubmitResponse,
  UpdateTransactionDetailsOpts,
  PayOpts,
  PayFn,
  UpdateTransactionDetailsFn,
  CheckoutObject,
  CheckoutFunction,
  PayComFunction,
  PayComNamespace
} from './types'
import { PayComScriptOptions } from './types/script-options'

const loadScript = (
  options: PayComScriptOptions,
  PromisePonyfill: PromiseConstructor
): Promise<PayComNamespace> => {
  validateArguments(options, PromisePonyfill)

  const { live, sdkUrlOverride } = options

  let jsUrl = live
    ? 'https://js.pay.com/v1.js'
    : 'https://js.staging.pay.com/v1.js'

  if (sdkUrlOverride) {
    jsUrl = sdkUrlOverride
  }

  const existingWindowNamespace = window.Pay

  const currentScript = findScript(jsUrl)
  if (currentScript && existingWindowNamespace) {
    return PromisePonyfill.resolve(existingWindowNamespace)
  }

  if (currentScript) {
    return new PromisePonyfill((resolve, reject) => {
      attachScriptListeners({
        script: currentScript,
        onSuccess: () => {
          const loadedWindowNamespace = window.Pay
          if (loadedWindowNamespace) {
            return resolve(loadedWindowNamespace)
          }

          reject(new Error(`The script failed to load.`))
        },
        onError: () => reject(new Error(`The script failed to load.`))
      })
    })
  }

  return loadCustomScript(
    {
      url: jsUrl
    },
    PromisePonyfill
  ).then(() => {
    const newWindowNamespace = window.Pay

    if (newWindowNamespace) {
      return newWindowNamespace
    }

    throw new Error(`The window.Pay global variable is not available.`)
  })
}

const loadCustomScript = (
  options: {
    url: string
    attributes?: Record<string, string>
  },
  PromisePonyfill: PromiseConstructor
): Promise<void> => {
  validateArguments(options, PromisePonyfill)

  const { url, attributes } = options

  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('Invalid url.')
  }

  if (typeof attributes !== 'undefined' && typeof attributes !== 'object') {
    throw new Error('Expected attributes to be an object.')
  }

  return new PromisePonyfill((resolve, reject) =>
    insertScriptElement({
      url,
      attributes,
      onSuccess: () => resolve(),
      onError: () => reject(new Error(`The script "${url}" failed to load.`))
    })
  )
}

const com = async (
  options: PayComScriptOptions,
  PromisePonyfill: PromiseConstructor = getDefaultPromiseImplementation()
) => {
  const Pay: PayComNamespace | null = await loadScript(options, PromisePonyfill)

  if (!Pay) {
    throw new Error('Wrong script URL provided')
  }

  return Pay.com(options)
}

export type {
  CheckoutToggles,
  PaypalOpts,
  RenderOpts,
  UniversalToggles,
  LanguageLocalizationOverride,
  DividerStyles,
  ExpandablePaymentMethods,
  ApmStyle,
  UniversalOpts,
  SubmitOpts,
  FailureError,
  CheckoutOpts,
  EVENT_TYPES,
  ListenerFn,
  ValidationResponse,
  ELEMENT_TYPES,
  SubmitResponse,
  UpdateTransactionDetailsOpts,
  PayOpts,
  PayFn,
  UpdateTransactionDetailsFn,
  CheckoutObject,
  CheckoutFunction,
  PayComFunction,
  PayComNamespace
}
export default { com }
