use anchor_lang::prelude::*;
use spl_associated_token_account::instruction::create_associated_token_account;
// use anchor_lang::solana_program::account_info::AccountInfo;
// use anchor_lang::solana_program::pubkey::Pubkey;
// use anchor_lang::Result;
// use anchor_lang::{context::Context, Accounts};
// pub use spl_associated_token_account;
// pub use solana_program::program::*;

declare_id!("6YeZtzM2HTsg9G5CGQ8kHWR6ehc5Qw1wJCHmjsR2cMJZ");

#[program]
pub mod testanchor {
    use super::*;
    pub fn create(ctx: Context<Create>) -> Result<()> {
        let ix =create_associated_token_account(
            ctx.accounts.payer.key,
            ctx.accounts.authority.key,
            ctx.accounts.mint.key,
        );
        solana_program::program::invoke_signed(
            &ix,
            &[
                ctx.accounts.payer.clone(),
                ctx.accounts.associated_token.clone(),
                ctx.accounts.authority.to_account_info(),
                ctx.accounts.mint.clone(),
                ctx.accounts.system_program.clone(),
                ctx.accounts.token_program.clone(),
                ctx.accounts.rent.clone(),
            ],
            &[&[&[2]]],
        )
        .map_err(Into::into)
    }
}


#[derive(Accounts)]
pub struct Create<'info> {
    pub payer: AccountInfo<'info>,
    pub associated_token: AccountInfo<'info>,
    pub authority: Signer<'info>,
    pub mint: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
    pub rent: AccountInfo<'info>,
}

// #[derive(Clone)]
// pub struct AssociatedToken;

// impl anchor_lang::Id for AssociatedToken {
//     fn id() -> Pubkey {
//         ID
//     }
// }
