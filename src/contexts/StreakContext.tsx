import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useGame } from "./GameContext";
import { SHOP_ITEMS } from "../constants/shop";


interface StreakContextType {
    streak: number,
    shopItems: string[],
    buyItem: (item: string) => void,
    useItem: (item: string) => void,
    userItems: string[],
}

// recuperer les streak depuis @GameContext.tsx
export const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: ReactNode }) {
    const { streak, spendStreak } = useGame()

    const [shopItems] = useState<string[]>([])
    const [userItems, setUserItems] = useState<string[]>([])

    const buyItem = (itemId: string) => {
        const itemObj = SHOP_ITEMS.find(item => item.id === itemId);

        if(!itemObj) return;
        
        const hasPaid = spendStreak(itemObj.cost);

        if(hasPaid) {
            setUserItems(prev => [...prev, itemId])
            console.log(`Achat réussi ! Vous avez maintenant ${streak} points de streak.`);
        } else {
            console.log(`Achat échoué ! Vous n'avez pas assez de points de streak.`);
        }
    }

    const useItem = (itemId: string) => {
        setUserItems(prev => prev.filter(i => i !== itemId))
    }

    const value = {
        streak,
        shopItems,
        buyItem,
        useItem,
        userItems
    }

    return (
        <StreakContext.Provider value={value}>
            {children}
        </StreakContext.Provider>
    )
}

export function useStreak() {
    const context = useContext(StreakContext)
    if (!context) {
        throw new Error('useStreak must be used within a StreakProvider')
    }
    return context
}