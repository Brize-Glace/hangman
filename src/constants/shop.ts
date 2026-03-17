export type ShopItem = {
    id: string;
    name: string;
    description: string;
    cost: number;
}

export const SHOP_ITEMS: ShopItem[] = [
    {id: 'hint_letter', name: 'Indice', description: 'Révèle une lettre au hasard', cost: 1},
    //{id: 'extra_life', name: 'Vie supplémentaire', description: 'Ajoute un essai supplémentaire', cost: 1},
    {id: 'shield', name: 'Bouclier', description: 'Protège contre une erreur', cost: 1},
]