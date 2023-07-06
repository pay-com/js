type StringMap = Record<string, string>;

export function findScript(
  url: string,
  attributes?: StringMap
): HTMLScriptElement | null {
  const currentScript = document.querySelector<HTMLScriptElement>(
    `script[src="${url}"]`
  );
  if (currentScript === null) return null;

  const nextScript = createScriptElement(url, attributes);

  // ignore the data-uid-auto attribute that gets auto-assigned to every script tag
  const currentScriptDataset = Object.assign({}, currentScript.dataset);
  delete currentScriptDataset.uidAuto;

  // check if the new script has the same number of data attributes
  if (
    Object.keys(currentScriptDataset).length !==
    Object.keys(nextScript.dataset).length
  ) {
    return null;
  }

  let isExactMatch = true;

  // check if the data attribute values are the same
  Object.keys(currentScriptDataset).forEach((key) => {
    if (currentScriptDataset[key] !== nextScript.dataset[key]) {
      isExactMatch = false;
    }
  });

  return isExactMatch ? currentScript : null;
}

export interface ScriptElement {
  url: string;
  attributes?: StringMap;
  onSuccess: () => void;
  onError: OnErrorEventHandler;
}

export function insertScriptElement({
  url,
  attributes,
  onSuccess,
  onError,
}: ScriptElement): void {
  const newScript = createScriptElement(url, attributes);
  newScript.onerror = onError;
  newScript.onload = onSuccess;

  document.head.insertBefore(newScript, document.head.firstElementChild);
}

export function objectToQueryString(params: StringMap): string {
  let queryString = "";

  Object.keys(params).forEach((key) => {
    if (queryString.length !== 0) queryString += "&";
    queryString += key + "=" + params[key];
  });
  return queryString;
}

function createScriptElement(
  url: string,
  attributes: StringMap = {}
): HTMLScriptElement {
  const newScript: HTMLScriptElement = document.createElement("script");
  newScript.src = url;

  Object.keys(attributes).forEach((key) => {
    newScript.setAttribute(key, attributes[key]);

    if (key === "data-csp-nonce") {
      newScript.setAttribute("nonce", attributes["data-csp-nonce"]);
    }
  });

  return newScript;
}
