interface PayComScriptQueryParameters {
  identifier: string
  sandbox?: boolean
  debug?: boolean
}

export interface PayComScriptOptions extends PayComScriptQueryParameters {
  sdkUrlOverride?: string
  live?: boolean
}
