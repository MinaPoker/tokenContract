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
    deploy (args: DeployArgs){
        super.deploy(args);
        const permissions = Permissions.proof();
        this.account.permissions.set({
            ...Permissions.default(),
            editState: permissionToEdit,
            setTokenSymbol:permissionToEdit,
            send: permissionToSend,
            receive: permissionToReceive,
        });
    }

    @method init(){

    }
    
    @method mint(){

    }

    @method sendTokens(){
        
    }
}