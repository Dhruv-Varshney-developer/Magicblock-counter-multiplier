import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorCounter } from "../target/types/anchor_counter";
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';

describe("anchor-counter without ephemeral rollup", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;
  
  // Define the PDA seed
  const SEED_TEST_PDA = "test-pda";
  let pda: PublicKey;

  before(async () => {
    // Generate PDA for counter
    [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_TEST_PDA)],
      program.programId
    );
  });

  it("Initializes the counter", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: pda,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Init Tx:", tx);

    const account = await program.account.counter.fetch(pda);
    console.log("Initial Counter Value:", account.count.toString());
    expect(account.count.toString()).to.equal("0");
  });

  it("Increments the counter", async () => {
    const tx = await program.methods
      .increment()
      .accounts({
        counter: pda,
      })
      .rpc();
    console.log("Increment Tx:", tx);

    const account = await program.account.counter.fetch(pda);
    console.log("Counter after increment:", account.count.toString());
    expect(account.count.toString()).to.equal("1");
  });

  it("Multiplies the counter by 2", async () => {
    const tx = await program.methods
      .multiply()
      .accounts({
        counter: pda,
      })
      .rpc();
    console.log("Multiply Tx:", tx);

    const account = await program.account.counter.fetch(pda);
    console.log("Counter after multiplication:", account.count.toString());
    expect(account.count.toString()).to.equal("2"); // Since previous value was 1
  });
});