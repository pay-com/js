import {
  attachScriptListeners,
  findScript,
  getDefaultPromiseImplementation,
  insertScriptElement,
  removeScript,
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

const MAX_RETRIES = 3

const attemptLoadScript = (
  jsUrl: string,
  PromisePonyfill: PromiseConstructor
): Promise<PayComNamespace> => {
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

const loadScript = (
  options: PayComScriptOptions,
  PromisePonyfill: PromiseConstructor
): Promise<PayComNamespace> => {
  validateArguments(options, PromisePonyfill)

  // One script for the sandbox and live: the session's client secret decides the environment, and js.pay.com sends
  // each call to the matching API. `live` is no longer read.
  const jsUrl = options.sdkUrlOverride || 'https://js.pay.com/v1.js'

  let attempt = 0

  const tryLoad = (): Promise<PayComNamespace> => {
    attempt += 1
    return attemptLoadScript(jsUrl, PromisePonyfill).catch(error => {
      removeScript(jsUrl)

      if (attempt < MAX_RETRIES) {
        return tryLoad()
      }

      throw error
    })
  }

  return tryLoad()
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
  const Pay = await loadScript(options, PromisePonyfill)

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
