use anchor_lang::prelude::*;

declare_id!("4keeQqDAPZxedBqYePC5jtH2HhjsinXXSQJPXwXAwmSe");

#[program]
pub mod anchor_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
