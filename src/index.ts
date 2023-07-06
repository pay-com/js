import { findScript, insertScriptElement } from './utils'
import { PayComScriptOptions } from './types/script-options'
import type {
  PayComNamespace,
  EVENT_TYPES,
  ListenerFn,
  PaypalOpts,
  UniversalOpts,
  UpdateTransactionDetailsOpts,
  SubmitOpts,
  RenderOpts,
  CheckoutToggles,
  CheckoutObject,
  PayComFunction,
  CheckoutFunction
} from './types'
/**
 * Load the PayCom JS SDK script asynchronously.
 *
 * @param {Object} options - used to configure query parameters and data attributes for the JS SDK.
 * @param {PromiseConstructor} [PromisePonyfill=window.Promise] - optional Promise Constructor ponyfill.
 * @return {Promise<Object>} PayComObject - reference to the global window PayCom object.
 */
function loadScript(
  options: PayComScriptOptions,
  PromisePonyfill: PromiseConstructor
): Promise<PayComNamespace | null> {
  validateArguments(options, PromisePonyfill)

  // resolve with null when running in Node
  if (typeof window === 'undefined') return PromisePonyfill.resolve(null)

  const { sdkBaseURL } = options

  let jsUrl = ''
  const url = window.location.hostname
  if (sdkBaseURL) {
    jsUrl = sdkBaseURL
  } else if (
    ['localhost', 'dev', 'staging'].some(envKey =>
      window.location.hostname.includes(envKey)
    )
  ) {
    jsUrl = 'https://js.dev.pay.com/v1.js'
  } else if (url.includes('.sandbox.')) {
    jsUrl = 'https://js.sandbox.pay.com/v1.js'
  } else {
    jsUrl = 'https://js.pay.com/v1.js'
  }

  const namespace = 'Pay'
  const existingWindowNamespace = getPayComWindowNamespace(namespace)

  // resolve with the existing global PayCom namespace when a script with the same params already exists
  if (findScript(jsUrl) && existingWindowNamespace) {
    return PromisePonyfill.resolve(existingWindowNamespace)
  }

  return loadCustomScript(
    {
      url: jsUrl
    },
    PromisePonyfill
  ).then(() => {
    const newWindowNamespace = getPayComWindowNamespace(namespace)

    if (newWindowNamespace) {
      return newWindowNamespace
    }

    throw new Error(`The window.${namespace} global variable is not available.`)
  })
}

/**
 * Load a custom script asynchronously.
 *
 * @param {Object} options - used to set the script url and attributes.
 * @param {PromiseConstructor} [PromisePonyfill=window.Promise] - optional Promise Constructor ponyfill.
 * @return {Promise<void>} returns a promise to indicate if the script was successfully loaded.
 */
function loadCustomScript(
  options: {
    url: string
    attributes?: Record<string, string>
  },
  PromisePonyfill: PromiseConstructor
): Promise<void> {
  validateArguments(options, PromisePonyfill)

  const { url, attributes } = options

  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('Invalid url.')
  }

  if (typeof attributes !== 'undefined' && typeof attributes !== 'object') {
    throw new Error('Expected attributes to be an object.')
  }

  return new PromisePonyfill((resolve, reject) => {
    // resolve with undefined when running in Node
    if (typeof window === 'undefined') return resolve()

    return insertScriptElement({
      url,
      attributes,
      onSuccess: () => resolve(),
      onError: () => reject(new Error(`The script "${url}" failed to load.`))
    })
  })
}

function getDefaultPromiseImplementation() {
  if (typeof Promise === 'undefined') {
    throw new Error(
      'Promise is undefined. To resolve the issue, use a Promise polyfill.'
    )
  }
  return Promise
}

function getPayComWindowNamespace(namespace: string): PayComNamespace {
  return (window as unknown as Record<string, PayComNamespace>)[namespace]
}

function validateArguments(options: unknown, PromisePonyfill?: unknown) {
  if (typeof options !== 'object' || options === null) {
    throw new Error('Expected an options object.')
  }

  if (
    typeof PromisePonyfill !== 'undefined' &&
    typeof PromisePonyfill !== 'function'
  ) {
    throw new Error('Expected PromisePonyfill to be a function.')
  }
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
  PayComNamespace,
  PaypalOpts,
  EVENT_TYPES,
  ListenerFn,
  UpdateTransactionDetailsOpts,
  SubmitOpts,
  RenderOpts,
  UniversalOpts,
  CheckoutToggles,
  CheckoutObject,
  PayComFunction,
  CheckoutFunction
}
export default { com }
