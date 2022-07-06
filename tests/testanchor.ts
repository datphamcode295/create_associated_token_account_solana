import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Testanchor } from '../target/types/testanchor';
import {PublicKey,SYSVAR_RENT_PUBKEY} from '@solana/web3.js';
import fs from "fs";
import path from "path";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
} from "@solana/spl-token"; 

export const getPayer = (file: String) => {
  const rawdata = fs.readFileSync(
      // replace with your key
      path.resolve("/home/datpham/.config/solana/" + file + ".json")
  );
  const keyData = JSON.parse(rawdata.toString());
  return anchor.web3.Keypair.fromSecretKey(new Uint8Array(keyData));
};

describe('testanchor', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Testanchor as Program<Testanchor>;

  it("Create associated token account", async () => {
    let tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

    //key wallet: [11,88,50,155,185,225,222,29,169,51,163,9,253,236,18,155,173,6,172,39,82,113,230,78,189,76,55,112,198,149,250,254,198,120,209,83,80,186,78,36,114,183,216,33,137,121,17,143,35,86,44,164,112,103,246,176,15,200,85,152,101,48,248,172]
    let mintAdress = new PublicKey("DxtQHCcnQVv3ZPUxYPLx2d12NeKHbhBztYzuNof9N4kH");
   
    //create publicKey for associated token account
    const associated_account: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  
 
    const myWallet = anchor.AnchorProvider.env().wallet;
    let signers = getPayer("id")
    console.log(mintAdress)
    console.log(myWallet.publicKey)
    console.log(associated_account.publicKey)
    console.log(tokenProgram)
    console.log(anchor.web3.SystemProgram.programId)
    console.log(SYSVAR_RENT_PUBKEY)
    await program.methods.create().accounts({
      payer: myWallet.publicKey,
      associatedToken: associated_account.publicKey,
      authority: myWallet.publicKey,
      mint: mintAdress,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: tokenProgram,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([])
    .rpc();

    //get the associated token account address
    const toATA = await getAssociatedTokenAddress(
      mintAdress,
      myWallet.publicKey
    );
    console.log("Create associated token account: ",toATA);

  });
});
