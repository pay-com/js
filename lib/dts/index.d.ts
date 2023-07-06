import { PayComScriptOptions } from './types/script-options';
import type { PayComNamespace, EVENT_TYPES, ListenerFn, PaypalOpts, UniversalOpts, UpdateTransactionDetailsOpts, SubmitOpts, RenderOpts, CheckoutToggles, CheckoutObject, PayComFunction, CheckoutFunction } from './types';
export type { PayComNamespace, PaypalOpts, EVENT_TYPES, ListenerFn, UpdateTransactionDetailsOpts, SubmitOpts, RenderOpts, UniversalOpts, CheckoutToggles, CheckoutObject, PayComFunction, CheckoutFunction };
declare const _default: {
    com: (options: PayComScriptOptions, PromisePonyfill?: PromiseConstructor) => Promise<{
        checkout: CheckoutFunction;
    }>;
};
export default _default;
