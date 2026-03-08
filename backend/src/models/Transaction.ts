import { Transaction } from '../utils/types';

export function formatTransaction(tx: Transaction) {
  return {
    ...tx,
    isCredit: tx.type === 'gift_received' || tx.type === 'admin_grant',
    isDebit: tx.type === 'purchase' || tx.type === 'gift_sent',
    formattedAmount: tx.amount >= 0 ? `+${tx.amount}` : `${tx.amount}`,
  };
}
