import {
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Permissions,
    UInt64,
    PublicKey,
    Signature,
} from 'o1js';

const tokenSymbol = 'MPC'; // Mina Poker Coin

export class MPCtoken extends SmartContract {

    @state(UInt64) totalAmountInCirculation = State<UInt64>();

    // deployer rules & permission interface setup
    deploy(args: DeployArgs) {
        super.deploy(args);
        const permissions = Permissions.proof();
        this.account.permissions.set({
            ...Permissions.default(),
            editState: permissionToEdit,
            setTokenSymbol: permissionToEdit,
            send: permissionToSend,
            receive: permissionToReceive,
        });
    }

    @method init() { // initialize the token & only called once
        super.init();
        this.account.tokenSymbol.set(tokenSymbol);
        this.totalAmountInCirculation.set(0);
    }

    @method mint(
        recieverAddress: PublicKey,
        amount: UInt64,
        signature: Signature
    ) {
        let totalAmountInCirculation = this.totalAmountInCirculation.get();
        this.totalAmountInCirculation.assertEquals(totalAmountInCirculation);

        let newTotalAmountInCirculation = totalAmountInCirculation.add(amount);
        signature.verify(this.address, amount.toFields().concat(recieverAddress.toFields())).assertTrue();
        this.token.mint({ address: recieverAddress, amount })
        this.totalAmountInCirculation.set(newTotalAmountInCirculation);
    }

    @method sendTokens(
        senderAddress: PublicKey,
        recieverAddress: PublicKey,
        amount: UInt64,
    ) {
        this.token.send({
            from: senderAddress,
            to: recieverAddress,
            amount
        });
    }

    @method AssetProof(owner: PublicKey){
        let account = Account(owner, this.token.id)
        account.balance.assertBetween( UInt64.from(10), UInt64.from(100000000))
    }

}