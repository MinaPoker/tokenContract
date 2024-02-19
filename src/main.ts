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
