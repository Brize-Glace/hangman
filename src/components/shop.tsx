// src/components/shop.tsx
import { useGame } from '../contexts/GameContext'
import { useStreak } from '../contexts/StreakContext'
import { SHOP_ITEMS } from '../constants/shop'

export function Shop() {
  const { streak, word, foundLetters, guessLetter } = useGame();
  const { buyItem, userItems, useItem } = useStreak();

  const handleUseHint = () => {
    // Plus besoin de vérifier `hasHintItem` ici car le bouton "Utiliser"
    // ne sera affiché que si on possède l'item !
    const unrevealedLetters = word.split('').filter(char => !foundLetters.includes(char.toLowerCase()));
    if (unrevealedLetters.length === 0) return;
    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    guessLetter(randomLetter);
    useItem('hint_letter'); // Consomme l'item
  }

  const handleUseItem = (itemId: string) => {
      switch(itemId) {
          case 'hint_letter':
              handleUseHint();
              break;
          case 'extra_life':
              // handleUseExtraLife(); 
              break;
          case 'shield':
              break;
          default:
              console.log("Item inconnu");
      }
  }

  return (
        <div>
            <h2>Boutique & Inventaire</h2>
            {SHOP_ITEMS.map(item => {
                // 1. On vérifie en direct si le joueur a cet item
                const isOwned = userItems.includes(item.id);

                return (
                    <div key={item.id} style={{ marginBottom: '10px' }}>
                        
                        {/* 2. On affiche les deux boutons différemment selon si on l'a ou pas */}
                        {isOwned ? (
                            <button 
                                onClick={() => handleUseItem(item.id)}
                                style={{ backgroundColor: 'green', color: 'white' }}
                            >
                                Utiliser {item.name}
                            </button>
                        ) : (
                            <button 
                                onClick={() => buyItem(item.id)}
                                disabled={streak < item.cost} 
                            >
                                Acheter {item.name} (-{item.cost} streak)
                            </button>
                        )}
                        
                    </div>
                )
            })}
        </div>
  )
}
