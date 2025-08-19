import { Connection, Keypair, SystemProgram, Transaction } from "@solana/web3.js"
const connection = new Connection("http://127.0.0.1:8899");

async function main(){
    const keys  =Keypair.generate();
    const dataAccount  = Keypair.generate();
    
    const res = await connection.requestAirdrop(keys.publicKey , 4000000000);
    await new Promise(r => setTimeout(r,20000));
    console.log(res);
    const bal =  await connection.getBalance(keys.publicKey);
    console.log(bal);   

    const ins = SystemProgram.createAccount({
            fromPubkey: keys.publicKey,
            /** Public key of the created account */
            newAccountPubkey: dataAccount.publicKey,
            /** Amount of lamports to transfer to the created account */
            lamports: 1000_000_000,
            /** Amount of space in bytes to allocate to the created account */
            space: 8,
            /** Public key of the program to assign as the owner of the created account */
            programId: SystemProgram.programId ,
        }
    )
    
    const tx = new Transaction().add(ins);
    tx.feePayer= keys.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.sign(keys);
    await connection.sendTransaction(tx , [keys , dataAccount]);
    console.log(dataAccount.publicKey.toBase58());
}
main()