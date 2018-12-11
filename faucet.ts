import { of, from, throwError } from 'rxjs'
import { flatMap, concatMap, catchError, map, tap } from 'rxjs/operators'

import { initializeWallet, activateWallet, transaction, originateContract, getWallet, confirmOperation } from './client'

import * as utils from './utils'
import * as fs from 'fs'

// support for node.js
import './node'
import { WalletType } from './src/enums';
import { ProcessingError, State } from './src/types';

const config = {
    transaction: {
        // hw_trezor_zero
        to: 'tz1ckrgqGGGBt4jGDmwFhtXc1LNpZJUnA9F2',
        // to: 'tz1UX1CrhjPSEkV8qUZuYnDiNuJtmwTA1j2p',
        amount: '1.23',
        fee: '1',
    },
    node: {
        name: 'zeronet',
        display: 'Zeronet',
        url: 'https://zeronet.simplestaking.com:3000',
        tzscan: {
            url: 'http://zeronet.tzscan.io/',
        }
    },
    type: WalletType.WEB,
}

// go to https://faucet.tzalpha.net/ and save files to ./faucet directory
// read connet of faucet files
const dir = './faucet/'
let faucets: {
    publicKeyHash: string
    mnemonic: string
    password: string,
    secret: string
}[] = []

// read directory
const files = fs.readdirSync(dir);
files.forEach((file: any) => {
    // read file 
    console.log('[file]', file)

    let faucet = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
    // save only files with mnemonic
    if (faucet.hasOwnProperty('mnemonic')) {
        faucets.push({
            'publicKeyHash': faucet.pkh,
            'mnemonic': faucet.mnemonic.join(' '),
            'password': faucet.email + faucet.password,
            'secret': faucet.secret,
        });
    }
});

// console.log(faucets[0])

// wait for sodium to initialize
utils.ready().then(() => {

    // activate wallet
    from(faucets).pipe(

        flatMap(faucet => of(faucet).pipe(

            // create privateKey & publicKey form mnemonic
            map((faucet) => ({
                wallet: {
                    ...utils.keys(faucet.mnemonic, faucet.password),
                    secret: faucet.secret,
                }
            })),

            tap((stateWallet) => console.log('\n\n[+] [stateWallet]', stateWallet.wallet.publicKeyHash)),

            // wait for sodium to initialize
            initializeWallet(stateWallet => ({
                secretKey: stateWallet.wallet.secretKey,
                publicKey: stateWallet.wallet.publicKey,
                publicKeyHash: stateWallet.wallet.publicKeyHash,
                secret: stateWallet.wallet.secret,
                // set Tezos node
                node: config.node,
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: config.type,
            })),

            // activate wallet
            activateWallet(stateWallet => ({
                secret: <string>stateWallet.wallet.secret
            })),

            // wait for transaction to be confirmed
            confirmOperation(stateWallet => ({
                injectionOperation: stateWallet.injectionOperation,
            })),

            // continue if wallet was activated already, otherwise throw error
            catchError<State, State>((error: ProcessingError) => {

                return error.response && error.response[0].id === 'proto.alpha.operation.invalid_activation' ?
                    of({ wallet: error.wallet }) : 
                    throwError(error)
            }),

            // get wallet info
            getWallet(),

            tap((stateWallet) => console.log('[+] getWallet: balance', (stateWallet.getWallet.balance / 1000000))),

            // send XTZ if balance is > 100 xt
            flatMap(stateWallet => (stateWallet.getWallet.balance / 1000000) > 1 ?
                of(stateWallet).pipe(                    

                    // send xtz
                    transaction(stateWallet => ({
                        to: config.transaction.to,
                        amount: ((stateWallet.getWallet.balance / 1000000) - 100).toString(),
                        // amount: 0.1,
                        fee: config.transaction.fee,
                    })),

                    // wait for transacation to be confirmed
                    confirmOperation(stateWallet => ({
                        injectionOperation: stateWallet.injectionOperation,
                    })),

                ) :
                of(stateWallet)
            ),

            // // originate contract
            // originateContract(stateWallet => ({
            //     amount: config.transaction.amount,
            //     fee: config.transaction.fee,
            // })),

        )),

    ).subscribe(data => {
        // console.log('[result]', data)
    })

})