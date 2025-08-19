use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

#[derive(BorshDeserialize, BorshSerialize)]
struct OnchainData {
    num: u32,
}

// Solana entrypoint macro
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let data_account = next_account_info(accounts_iter)?;

    // Deserialize
    let mut counter = OnchainData::try_from_slice(&data_account.data.borrow())?;

    // Logic
    if counter.num == 0 {
        counter.num = 1;
    } else {
        counter.num = counter.num * 2;
    }

    // Serialize (write back to account)
    counter.serialize(&mut &mut data_account.data.borrow_mut()[..])?;

    Ok(())
}
