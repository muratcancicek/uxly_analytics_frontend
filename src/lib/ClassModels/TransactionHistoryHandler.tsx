import { differenceInSeconds, parseISO } from 'date-fns';
import Transaction from './Transaction';

class TransactionHistoryHandler {
    private transactions: Transaction[];
    private transfers: Transaction[];
    private sentTransactions: Transaction[];
    private receivedTransactions: Transaction[];
    private totalLength: number;
    // private contractTransactions: Transaction[];
    // private erc20Transactions: Transaction[];
    // private erc20SentTransactions: Transaction[];
    // private erc20ReceivedTransactions: Transaction[];
    // private erc20ContractTransactions: Transaction[];

    constructor(address: string, transactions: any[]) {
        let tnxs = transactions.map(t => new Transaction(address, t));
        tnxs = tnxs.sort((a, b) => a.blockTimestamp.localeCompare(b.blockTimestamp));
        this.transactions = tnxs;
        this.totalLength = tnxs.length;
        this.transfers = tnxs.filter(t => t.isTransfer);
        this.sentTransactions = this.transfers.filter(t => t.isSent);
        this.receivedTransactions = this.transfers.filter(t => t.isReceived);
        // this.contractTransactions = tnxs.filter(t => t.isContractCreation);
        // const erc20tnxs = transactions.filter(t => t.isERC20);
        // this.erc20Transactions = erc20tnxs;
        // this.erc20SentTransactions = erc20tnxs.filter(t => t.isSent);
        // this.erc20ReceivedTransactions = erc20tnxs.filter(t => t.isReceived);
        // const contTrans = erc20tnxs.filter(t => t.isContractCreation);
        // this.erc20ContractTransactions = contTrans;
    }

    private calculateAverageMinutesBetweenTransactions(transactions: Transaction[]): number {
        if (transactions.length < 2) {
            return 0;
        }
        const dates = transactions.map(t => new Date(t.blockTimestamp));
        const diffs = dates.slice(1).map((date, i) => (date.getTime() - dates[i].getTime()) / 1000);
        const average = diffs.reduce((acc, val) => acc + val, 0) / diffs.length;
        return average / 60;
    }

    private calculateAverageMinutesBetweenSentTransactions(): number {
        return this.calculateAverageMinutesBetweenTransactions(this.sentTransactions);
    }

    private calculateAverageMinutesBetweenReceivedTransactions(): number {
        return this.calculateAverageMinutesBetweenTransactions(this.receivedTransactions);
    }

    private _calculateTimeDiffBetweenFirstAndLastMins(tnxs: Transaction[]): number {
        if (tnxs.length < 2) {
            return 0;
        }
        const first = parseISO(tnxs[0].blockTimestamp);
        const last = parseISO(tnxs[tnxs.length - 1].blockTimestamp);
        return differenceInSeconds(last, first) / 60;
    }

    private calculateTimeDiffBetweenFirstAndLastMins(): number {
        return this._calculateTimeDiffBetweenFirstAndLastMins(this.transactions);
    }

    private calculateSentTnx(): number {
        return this.sentTransactions.length;
    }

    private calculateReceivedTnx(): number {
        return this.receivedTransactions.length;
    }

    // private calculateNumberOfCreatedContracts(): number {
    //     const conts = new Set(this.contractTransactions);
    //     return conts.size;
    // }

    private _calculateUniqueReceivedFromAddresses(transactions: Transaction[]): number {
        const addresses = new Set(transactions.map(t => t.fromAddress));
        return addresses.size;
    }

    private calculateUniqueReceivedFromAddresses(): number {
        return this._calculateUniqueReceivedFromAddresses(this.receivedTransactions);
    }
    private _calculateUniqueSentToAddresses(transactions: Transaction[]): number {
        const addresses = new Set(transactions.map(t => t.toAddress));
        return addresses.size;
    }

    private calculateUniqueSentToAddresses(): number {
        return this._calculateUniqueSentToAddresses(this.sentTransactions);
    }

    private calculateMinValue(transactions: Transaction[]): number {
        if (!transactions.length) {
            return 0;
        }
        return Math.min(...transactions.map(t => t.value));
    }

    private calculateMinValueReceived(): number {
        return this.calculateMinValue(this.receivedTransactions);
    }

    private calculateMaxValue(transactions: Transaction[]): number {
        if (!transactions.length) {
            return 0;
        }
        return Math.max(...transactions.map(t => t.value));
    }

    private calculateMaxValueReceived(): number {
        return this.calculateMaxValue(this.receivedTransactions);
    }

    private calculateAvgValue(transactions: Transaction[]): number {
        if (!transactions.length) {
            return 0;
        }
        const sum = transactions.reduce((acc, t) => acc + t.value, 0);
        return sum / transactions.length;
    }

    private calculateAvgValReceived(): number {
        return this.calculateAvgValue(this.receivedTransactions);
    }

    private calculateMinValSent(): number {
        return this.calculateMinValue(this.sentTransactions);
    }

    private calculateMaxValSent(): number {
        return this.calculateMaxValue(this.sentTransactions);
    }

    private calculateAvgValSent(): number {
        return this.calculateAvgValue(this.sentTransactions);
    }

    // private calculateMinValueSentToContract(): number {
    //     return this.calculateMinValue(this.contractTransactions);
    // }

    // private calculateMaxValSentToContract(): number {
    //     return this.calculateMaxValue(this.contractTransactions);
    // }

    // private calculateAvgValueSentToContract(): number {
    //     return this.calculateAvgValue(this.contractTransactions);
    // }

    private calculateTotalTransactionsIncludingTnxToCreateContract(): number {
        return this.totalLength;
    }

    private calculateTotalEtherSent(): number {
        return this.sentTransactions.reduce((acc, t) => acc + t.value, 0);
    }

    private calculateTotalEtherReceived(): number {
        return this.receivedTransactions.reduce((acc, t) => acc + t.value, 0);
    }

    // private calculateTotalEtherSentContracts(): number {
    //     return this.contractTransactions.reduce((acc, t) => acc + t.value, 0);
    // }

    private calculateTotalEtherBalance(): number {
        const received = this.calculateTotalEtherReceived();
        const sent = this.calculateTotalEtherSent();
        return received - sent;
    }

    // private calculateTotalERC20Tnxs(): number {
    //     return this.erc20Transactions.length;
    // }

    // private calculateERC20TotalEtherReceived(): number {
    //     return this.erc20ReceivedTransactions.reduce((acc, t) => acc + t.value, 0);
    // }

    // private calculateERC20TotalEtherSent(): number {
    //     return this.erc20SentTransactions.reduce((acc, t) => acc + t.value, 0);
    // }

    // private calculateERC20TotalEtherSentContract(): number {
    //     return this.erc20ContractTransactions.reduce((acc, t) => acc + t.value, 0);
    // }

    // private calculateERC20UniqSentAddr(): number {
    //     return this._calculateUniqueSentToAddresses(this.erc20SentTransactions);
    // }

    // private calculateERC20UniqRecAddr(): number {
    //     return this._calculateUniqueReceivedFromAddresses(this.erc20ReceivedTransactions);
    // }

    // private calculateERC20UniqSentAddr1(): number {
    //     return this.calculateERC20UniqSentAddr();
    // }

    // private calculateERC20UniqRecContractAddr(): number {
    //     const addresses = new Set(this.erc20ContractTransactions.map(t => t.fromAddress));
    //     return addresses.size;
    // }
    // private calculateERC20AvgTimeBetweenSentTnx(): number {
    //     return this.calculateAverageMinutesBetweenTransactions(this.erc20SentTransactions);
    // }

    // private calculateERC20AvgTimeBetweenRecTnx(): number {
    //     return this.calculateAverageMinutesBetweenTransactions(this.erc20ReceivedTransactions);
    // }

    // private calculateERC20AvgTimeBetweenRec2Tnx(): number {
    //     return this.calculateERC20AvgTimeBetweenRecTnx();
    // }

    // private calculateERC20AvgTimeBetweenContractTnx(): number {
    //     return this.calculateAverageMinutesBetweenTransactions(this.erc20ContractTransactions);
    // }
    // private calculateERC20MinValRec(): number {
    //     return this.calculateMinValue(this.erc20ReceivedTransactions);
    // }

    // private calculateERC20MaxValRec(): number {
    //     return this.calculateMaxValue(this.erc20ReceivedTransactions);
    // }

    // private calculateERC20AvgValRec(): number {
    //     return this.calculateAvgValue(this.erc20ReceivedTransactions);
    // }

    // private calculateERC20MinValSent(): number {
    //     return this.calculateMinValue(this.erc20SentTransactions);
    // }

    // private calculateERC20MaxValSent(): number {
    //     return this.calculateMaxValue(this.erc20SentTransactions);
    // }

    // private calculateERC20AvgValSent(): number {
    //     return this.calculateAvgValue(this.erc20SentTransactions);
    // }

    // private calculateERC20MinValSentContract(): number {
    //     return this.calculateMinValue(this.erc20ContractTransactions);
    // }

    // private calculateERC20MaxValSentContract(): number {
    //     return this.calculateMaxValue(this.erc20ContractTransactions);
    // }

    // private calculateERC20AvgValSentContract(): number {
    //     return this.calculateAvgValue(this.erc20ContractTransactions);
    // }

    // private calculateERC20UniqSentTokenName(): number {
    //     const tokens = new Set(this.erc20SentTransactions.map(t => t.input.slice(0, 10)));
    //     return tokens.size;
    // }

    // private calculateERC20UniqRecTokenName(): number {
    //     const tokens = new Set(this.erc20ReceivedTransactions.map(t => t.input.slice(0, 10)));
    //     return tokens.size;
    // }

    // public calculateERC20MostSentTokenType(): string | undefined {
    //     if (!this.erc20SentTransactions.length) {
    //         return '';
    //     }
    //     const tokens = this.erc20SentTransactions.map(t => t.input.slice(0, 10));
    //     return tokens.sort((a, b) => tokens.filter(v => v === a).length - tokens.filter(v => v === b).length).pop();
    // }

    // public calculateERC20MostRecTokenType(): string | undefined {
    //     if (!this.erc20ReceivedTransactions.length) {
    //         return '';
    //     }
    //     const tokens = this.erc20ReceivedTransactions.map(t => t.input.slice(0, 10));
    //     return tokens.sort((a, b) => tokens.filter(v => v === a).length - tokens.filter(v => v === b).length).pop();
    // }


    public getHistoryVectorized(): number[] {
        return [
            this.calculateAverageMinutesBetweenSentTransactions(),
            this.calculateAverageMinutesBetweenReceivedTransactions(),
            this.calculateTimeDiffBetweenFirstAndLastMins(),
            this.calculateSentTnx(),
            this.calculateReceivedTnx(),
            // this.calculateNumberOfCreatedContracts(),
            this.calculateUniqueReceivedFromAddresses(),
            this.calculateUniqueSentToAddresses(),
            this.calculateMinValueReceived(),
            this.calculateMaxValueReceived(),
            this.calculateAvgValReceived(),
            this.calculateMinValSent(),
            this.calculateMaxValSent(),
            this.calculateAvgValSent(),
            // this.calculateMinValueSentToContract(),
            // this.calculateMaxValSentToContract(),
            // this.calculateAvgValueSentToContract(),
            this.calculateTotalTransactionsIncludingTnxToCreateContract(),
            this.calculateTotalEtherSent(),
            this.calculateTotalEtherReceived(),
            // this.calculateTotalEtherSentContracts(),
            this.calculateTotalEtherBalance(),
            // this.calculateTotalERC20Tnxs(),
            // this.calculateERC20TotalEtherReceived(),
            // this.calculateERC20TotalEtherSent(),
            // this.calculateERC20TotalEtherSentContract(),
            // this.calculateERC20UniqSentAddr(),
            // this.calculateERC20UniqRecAddr(),
            // this.calculateERC20UniqSentAddr1(),
            // this.calculateERC20UniqRecContractAddr(),
            // this.calculateERC20AvgTimeBetweenSentTnx(),
            // this.calculateERC20AvgTimeBetweenRecTnx(),
            // this.calculateERC20AvgTimeBetweenRec2Tnx(),
            // this.calculateERC20AvgTimeBetweenContractTnx(),
            // this.calculateERC20MinValRec(),
            // this.calculateERC20MaxValRec(),
            // this.calculateERC20AvgValRec(),
            // this.calculateERC20MinValSent(),
            // this.calculateERC20MaxValSent(),
            // this.calculateERC20AvgValSent(),
            // this.calculateERC20MinValSentContract(),
            // this.calculateERC20MaxValSentContract(),
            // this.calculateERC20AvgValSentContract(),
            // this.calculateERC20UniqSentTokenName(),
            // this.calculateERC20UniqRecTokenName(),
        ];
    }
}

export default TransactionHistoryHandler;
