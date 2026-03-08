import { Gift } from '../utils/types';

export function formatGift(gift: Gift) {
  return {
    ...gift,
    rarityColor: getRarityColor(gift.rarity),
    rarityLabel: gift.rarity.charAt(0).toUpperCase() + gift.rarity.slice(1),
  };
}

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return '#9e9e9e';
    case 'rare': return '#2196f3';
    case 'epic': return '#9c27b0';
    case 'legendary': return '#ff9800';
    default: return '#9e9e9e';
  }
}
