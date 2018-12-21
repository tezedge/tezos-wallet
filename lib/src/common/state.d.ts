import { OperationMetadata } from "./operations";
import { TezosNode } from './config';
import { RpcParams } from './rpc';
export interface State {
    activateWallet?: ActivatedWallet;
    confirmOperation?: ConfirmOperation;
    counter?: number;
    getWallet?: WalletDetail;
    head?: Head;
    injectionOperation?: InjectionOperation;
    manager_key?: ManagerKey;
    mempool?: Mempool;
    originateContract?: OriginatedContract;
    operation?: string;
    operations?: OperationMetadata[];
    packOperationParameters?: PackOperationParameters;
    pendingOperation?: PendingOperation;
    preapply?: PreapplyOperation[];
    rpc?: RpcParams;
    setDelegate?: SetDelegate;
    signOperation?: SignOperation;
    transaction?: Transaction;
    wallet: Wallet;
}
export declare type ActivatedWallet = {
    secret: string;
};
export declare type ConfirmOperation = {
    injectionOperation: InjectionOperation;
};
export declare type Head = {
    chain_id: string;
    hash: string;
    header: {
        context: string;
        fitness: [string, string];
        level: number;
        operations_hash: string;
        predecessor: string;
        priority: number;
        proof_of_work_nonce: string;
        proto: number;
        signature: string;
        timestamp: string;
        validation_pass: number;
    };
    metadata: {
        baker: string;
        balance_updates: any[];
        consumed_gas: string;
        deactivated: any[];
        level: any;
        max_block_header_length: number;
        max_operation_data_length: number;
        max_operation_list_length: {
            max_size: number;
            max_op?: number;
        }[];
        max_operations_ttl: number;
        next_protocol: string;
        nonce_hash: string | null;
        protocol: string;
        test_chain_status: {
            status: 'running' | 'not_running';
        };
        voting_period_kind: 'proposal';
    };
    operations: {
        branch: string;
        chain_id: string;
        contents: {
            kind: string;
            level: number;
            metadata: any;
        }[];
        hash: string;
        protocol: string;
        signature: string;
    }[];
    protocol: string;
};
export declare type InjectionOperation = {};
export declare type MempoolOperation = {
    branch: string;
    contents: any;
    hash: string;
    signature: string;
};
export declare type Mempool = {
    applied: MempoolOperation[];
    branch_delayed: MempoolOperation[];
    branch_refused: MempoolOperation[];
    refused: MempoolOperation[];
    unprocessed: MempoolOperation[];
};
export declare type ManagerKey = {
    manager: string;
    key: string;
};
export declare type OriginatedContract = {
    fee: string;
    amount: string;
    to: string;
};
export declare type PackOperationParameters = {};
export declare type PendingOperation = {
    publicKeyHash: string;
};
export declare type PreapplyOperation = {
    contents: {
        metadata: {
            operation_result: any;
        };
    }[];
    signature: string;
};
export declare type SetDelegate = {
    fee: string;
    to: string;
};
export declare type SignOperation = {
    signature: string;
    signedOperationContents: string;
    operationHash: string;
};
export declare type Transaction = {
    amount: string;
    fee: string;
    to: string;
    parameters?: Record<string, any>;
};
export declare type Wallet = {
    mnemonic?: string;
    path?: string;
    node: TezosNode;
    publicKey?: string;
    publicKeyHash: string;
    secret?: string;
    secretKey?: string;
    type?: 'web' | 'TREZOR_T' | 'TREZOR_P';
};
export declare type WalletDetail = {
    balance: number;
};