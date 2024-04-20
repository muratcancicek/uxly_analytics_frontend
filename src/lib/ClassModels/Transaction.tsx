
// interface IErc20Signatures {
//   [key: string]: string;
//   "0xa9059cbb": string;
//   "0x095ea7b3": string;
//   "0x23b872dd": string;
// }

// const erc20_signatures: IErc20Signatures = {
//   "0xa9059cbb": "erc20_transfer_signature",
//   "0x095ea7b3": "erc20_approve_signature",
//   "0x23b872dd": "erc20_transfer_from_signature",
// }

interface ITransactionArgs {
  block_hash: string;
  block_timestamp: string;
  decimal_value: string;
  from_address: string;
  gas: string;
  gas_price: string;
  nonce: number;
  to_address: string;
  value: string;
  // transactionIndex: number;
  // toAddressLabel: string | undefined;
  // input: string;
  // receiptCumulativeGasUsed: number;
  // receiptGasUsed: number;
  // receiptContractAddress: string | undefined;
  // receiptRoot: string | undefined;
  // receiptStatus: number;
  // blockNumber: number;
  // blockHash: string;
  // transferIndex: number | undefined;
}

class Transaction {
    public accountAddress: string;
    public isReceived: boolean;
    public isSent: boolean;
    public isTransfer: boolean;
    public hash: string;
    public nonce: number;
    public fromAddress: string;
    public toAddress: string;
    public toAddressLabel: string | undefined;
    public value: number;
    public gas: string;
    public gasPrice: number;
    public blockTimestamp: string;
    // public transactionIndex: number;
    // public input: string;
    // public receiptCumulativeGasUsed: number;
    // public receiptGasUsed: number;
    // public receiptContractAddress: string | undefined;
    // public receiptRoot: string | undefined;
    // public receiptStatus: number;
    // public blockNumber: number;
    // public blockHash: string;
    // public transferIndex: number | undefined;
    // public erc20Code: string | undefined;
    // public isERC20: boolean;
    // public erc20Function: string | undefined;
    // public isContractCreation: boolean;

    constructor(accountAddress: string, args: ITransactionArgs) {
        this.accountAddress =  accountAddress;
        this.hash = args.block_hash;
        this.nonce = args.nonce;
        this.fromAddress = args.from_address;
        this.toAddress = args.to_address;
        this.value = parseFloat(args.decimal_value) / 1e18;
        this.gas = args.gas;
        this.gasPrice = parseFloat(args.gas_price);
        this.isReceived = this.toAddress === this.accountAddress;
        this.isSent = this.fromAddress === this.accountAddress;
        this.isTransfer = this.value !== 0;
        this.blockTimestamp = args.block_timestamp;
        // this.toAddressLabel = args.toAddressLabel;
        // this.transactionIndex = args.transactionIndex;
        // this.input = args.input;
        // this.receiptCumulativeGasUsed = args.receiptCumulativeGasUsed;
        // this.receiptGasUsed = args.receiptGasUsed;
        // this.receiptContractAddress = args.receiptContractAddress;
        // this.receiptRoot = args.receiptRoot;
        // this.receiptStatus = args.receiptStatus;
        // this.blockNumber = args.blockNumber;
        // this.blockHash = args.blockHash;
        // this.transferIndex = args.transferIndex;
        // this.erc20Code = args.input.slice(0, 10);
        // this.isERC20 = this.erc20Code in erc20_signatures;
        // this.erc20Function = erc20_signatures[this.erc20Code] || undefined;
        // this.isContractCreation = this.receiptContractAddress !== undefined;
    }
}

export default Transaction;