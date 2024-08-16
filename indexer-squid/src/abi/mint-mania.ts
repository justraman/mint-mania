import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    TokenBought: event("0x8692cf5ba66abd64f88cdc1ffa0ee9d9c21ee2d999322a20445ae32393394e3e", "TokenBought(address,address,uint256,uint256,uint256)", {"token": p.address, "buyer": p.address, "amount": p.uint256, "tokenAmount": p.uint256, "price": p.uint256}),
    TokenCreated: event("0xffc04f682c7b287e4b552dacd4b833d7c33dc0549cd6da84388408e4830c0562", "TokenCreated(address,string,string)", {"token": p.address, "name": p.string, "symbol": p.string}),
    TokenSold: event("0x9387a595ac4be9038bbb9751abad8baa3dcf219dd9e19abb81552bd521fe3546", "TokenSold(address,address,uint256,uint256,uint256)", {"token": p.address, "seller": p.address, "amount": p.uint256, "tokenAmount": p.uint256, "price": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
}

export const functions = {
    INITIAL_COLLATORAL: viewFun("0xba130998", "INITIAL_COLLATORAL()", {}, p.uint256),
    INITIAL_SUPPLY: viewFun("0x2ff2e9dc", "INITIAL_SUPPLY()", {}, p.uint256),
    MAX_SUPPLY: viewFun("0x32cb6b0c", "MAX_SUPPLY()", {}, p.uint256),
    buy: fun("0xcce7ec13", "buy(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    calculateSaleReturn: viewFun("0x7d9824c6", "calculateSaleReturn(address,uint256)", {"token": p.address, "amountToken": p.uint256}, p.uint256),
    calculateTokenReturn: viewFun("0x627371c0", "calculateTokenReturn(address,uint256)", {"token": p.address, "amount": p.uint256}, p.uint256),
    create: fun("0x5d28560a", "create(string,string,string)", {"name": p.string, "symbol": p.string, "uri": p.string}, ),
    getMarketCap: viewFun("0xd146d31d", "getMarketCap(address)", {"token": p.address}, p.uint256),
    getPrice: viewFun("0x41976e09", "getPrice(address)", {"token": p.address}, p.uint256),
    getToken: viewFun("0x59770438", "getToken(address)", {"token": p.address}, {"_0": p.string, "_1": p.string, "_2": p.string, "_3": p.bool}),
    getTokens: viewFun("0xaa6ca808", "getTokens()", {}, p.array(p.address)),
    launch: fun("0x214013ca", "launch(address)", {"token": p.address}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    sell: fun("0x6c197ff5", "sell(address,uint256)", {"token": p.address, "amountToken": p.uint256}, ),
    stableToken: viewFun("0xa9d75b2b", "stableToken()", {}, p.address),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
}

export class Contract extends ContractBase {

    INITIAL_COLLATORAL() {
        return this.eth_call(functions.INITIAL_COLLATORAL, {})
    }

    INITIAL_SUPPLY() {
        return this.eth_call(functions.INITIAL_SUPPLY, {})
    }

    MAX_SUPPLY() {
        return this.eth_call(functions.MAX_SUPPLY, {})
    }

    calculateSaleReturn(token: CalculateSaleReturnParams["token"], amountToken: CalculateSaleReturnParams["amountToken"]) {
        return this.eth_call(functions.calculateSaleReturn, {token, amountToken})
    }

    calculateTokenReturn(token: CalculateTokenReturnParams["token"], amount: CalculateTokenReturnParams["amount"]) {
        return this.eth_call(functions.calculateTokenReturn, {token, amount})
    }

    getMarketCap(token: GetMarketCapParams["token"]) {
        return this.eth_call(functions.getMarketCap, {token})
    }

    getPrice(token: GetPriceParams["token"]) {
        return this.eth_call(functions.getPrice, {token})
    }

    getToken(token: GetTokenParams["token"]) {
        return this.eth_call(functions.getToken, {token})
    }

    getTokens() {
        return this.eth_call(functions.getTokens, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    stableToken() {
        return this.eth_call(functions.stableToken, {})
    }
}

/// Event types
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PausedEventArgs = EParams<typeof events.Paused>
export type TokenBoughtEventArgs = EParams<typeof events.TokenBought>
export type TokenCreatedEventArgs = EParams<typeof events.TokenCreated>
export type TokenSoldEventArgs = EParams<typeof events.TokenSold>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>

/// Function types
export type INITIAL_COLLATORALParams = FunctionArguments<typeof functions.INITIAL_COLLATORAL>
export type INITIAL_COLLATORALReturn = FunctionReturn<typeof functions.INITIAL_COLLATORAL>

export type INITIAL_SUPPLYParams = FunctionArguments<typeof functions.INITIAL_SUPPLY>
export type INITIAL_SUPPLYReturn = FunctionReturn<typeof functions.INITIAL_SUPPLY>

export type MAX_SUPPLYParams = FunctionArguments<typeof functions.MAX_SUPPLY>
export type MAX_SUPPLYReturn = FunctionReturn<typeof functions.MAX_SUPPLY>

export type BuyParams = FunctionArguments<typeof functions.buy>
export type BuyReturn = FunctionReturn<typeof functions.buy>

export type CalculateSaleReturnParams = FunctionArguments<typeof functions.calculateSaleReturn>
export type CalculateSaleReturnReturn = FunctionReturn<typeof functions.calculateSaleReturn>

export type CalculateTokenReturnParams = FunctionArguments<typeof functions.calculateTokenReturn>
export type CalculateTokenReturnReturn = FunctionReturn<typeof functions.calculateTokenReturn>

export type CreateParams = FunctionArguments<typeof functions.create>
export type CreateReturn = FunctionReturn<typeof functions.create>

export type GetMarketCapParams = FunctionArguments<typeof functions.getMarketCap>
export type GetMarketCapReturn = FunctionReturn<typeof functions.getMarketCap>

export type GetPriceParams = FunctionArguments<typeof functions.getPrice>
export type GetPriceReturn = FunctionReturn<typeof functions.getPrice>

export type GetTokenParams = FunctionArguments<typeof functions.getToken>
export type GetTokenReturn = FunctionReturn<typeof functions.getToken>

export type GetTokensParams = FunctionArguments<typeof functions.getTokens>
export type GetTokensReturn = FunctionReturn<typeof functions.getTokens>

export type LaunchParams = FunctionArguments<typeof functions.launch>
export type LaunchReturn = FunctionReturn<typeof functions.launch>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SellParams = FunctionArguments<typeof functions.sell>
export type SellReturn = FunctionReturn<typeof functions.sell>

export type StableTokenParams = FunctionArguments<typeof functions.stableToken>
export type StableTokenReturn = FunctionReturn<typeof functions.stableToken>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

