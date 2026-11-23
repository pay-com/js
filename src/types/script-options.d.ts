interface PayComScriptQueryParameters {
  identifier: string
  sandbox?: boolean
  debug?: boolean
}

export interface PayComScriptOptions extends PayComScriptQueryParameters {
  sdkUrlOverride?: string
  /**
   * @deprecated Ignored. The SDK always loads from https://js.pay.com, and the session's client secret decides
   * whether it runs in the sandbox or live.
   */
  live?: boolean
}
