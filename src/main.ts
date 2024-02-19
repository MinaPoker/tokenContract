import { MPCtoken } from './Token.ts';
import {
    Mina,
    PrivateKey,
    AccountUpdate,
    UInt64,
    Signature,
} from 'o1js';


const proofsEnabled = false;
const Local = Mina.LocalBlockchain({ proofsEnabled });
Mina.setActiveInstance(Local);
const deployerAccount = Local.testAccounts[0].privateKey;
// ----------------------------------------------------

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

console.log('compiling...');

let verificationKey: any;
if (proofsEnabled) {
    ({ verificationKey } = await MPCtoken.compile());
}

console.log('compiled');

// deploying testing
console.log('deploying...');
const contract = new MPCtoken(zkAppAddress);
const deploy_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
    AccountUpdate.fundNewAccount(deployerAccount.toPublicKey());
    contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
});
await deploy_txn.prove();
await deploy_txn.sign([deployerAccount]).send();

console.log('deployed');


// minting testing
console.log('minting...');

const mintAmount = UInt64.from(10);

const mintSignature = Signature.create(
    zkAppPrivateKey,
    mintAmount.toFields().concat(zkAppAddress.toFields())
);

const mint_txn = await Mina.transaction(deployerAccount.toPublicKey(), () => {
    AccountUpdate.fundNewAccount(deployerAccount.toPublicKey());
    contract.mint(zkAppAddress, mintAmount, mintSignature);
});

await mint_txn.prove();
await mint_txn.sign([deployerAccount]).send();

console.log('minted');

console.log(
    contract.totalAmountInCirculation.get() +
    ' ' +
    Mina.getAccount(zkAppAddress).tokenSymbol
);


