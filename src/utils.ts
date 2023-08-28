type StringMap = Record<string, string>

export const findScript = (
  url: string,
  attributes?: StringMap
): HTMLScriptElement | null => {
  const currentScript = document.querySelector<HTMLScriptElement>(
    `script[src="${url}"]`
  )
  if (!currentScript) return null

  const nextScript = createScriptElement(url, attributes)

  const currentScriptDataset = { ...currentScript.dataset }
  delete currentScriptDataset.uidAuto

  if (
    Object.keys(currentScriptDataset).length !==
    Object.keys(nextScript.dataset).length
  ) {
    return null
  }

  const isExactMatch = Object.entries(currentScriptDataset).every(
    ([key, currentDatasetValue]) =>
      currentDatasetValue === nextScript.dataset[key]
  )

  return isExactMatch ? currentScript : null
}

export interface ScriptElement {
  url: string
  attributes?: StringMap
  onSuccess: () => void
  onError: () => void
}

export const insertScriptElement = ({
  url,
  attributes,
  onSuccess,
  onError
}: ScriptElement): void => {
  const newScript = createScriptElement(url, attributes)

  attachScriptListeners({
    script: newScript,
    onSuccess,
    onError
  })

  document.head.insertBefore(newScript, document.head.firstElementChild)
}

export const getDefaultPromiseImplementation = () => {
  if (typeof Promise === 'undefined') {
    throw new Error(
      'Promise is undefined. To resolve the issue, use a Promise polyfill.'
    )
  }

  return Promise
}

export const validateArguments = (
  options: unknown,
  PromisePonyfill?: unknown
) => {
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

export const objectToQueryString = (params: StringMap): string => {
  let queryString = ''

  Object.keys(params).forEach(key => {
    if (queryString.length !== 0) queryString += '&'
    queryString += `${key}=${params[key]}`
  })
  return queryString
}

export interface AttachScriptListenersI {
  script: HTMLScriptElement
  onSuccess: () => void
  onError: () => void
}

export const attachScriptListeners = ({
  script,
  onSuccess,
  onError
}: AttachScriptListenersI) => {
  script.addEventListener('load', onSuccess, false)
  script.addEventListener('error', onError, false)
}

const createScriptElement = (
  url: string,
  attributes: StringMap = {}
): HTMLScriptElement => {
  const newScript: HTMLScriptElement = document.createElement('script')
  newScript.src = url

  Object.keys(attributes).forEach(key => {
    newScript.setAttribute(key, attributes[key])

    if (key === 'data-csp-nonce') {
      newScript.setAttribute('nonce', attributes['data-csp-nonce'])
    }
  })

  return newScript
}
