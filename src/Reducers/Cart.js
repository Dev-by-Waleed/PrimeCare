import { produce } from "immer";

// using immer to make the logic less complicated
const cartReducer = produce((draft, action) => {
    switch (action.type) {
        case "addProduct": {
            // draft is a safe, mutable proxy of your state
            const existingItem = draft.find(item => item.id === action.payload.id);
            const quantityToAdd = action.payload.quantity || 1;

            if (existingItem) {
                // You can just reassign the value directly! Immer handles the rest.
                existingItem.quantity = (existingItem.quantity || 0) + quantityToAdd;
            } else {
                // You can even use standard .push()
                draft.push({ ...action.payload, quantity: quantityToAdd });
            }
            break; // Note: In Immer, you use 'break' instead of returning state
        }

        case "deleteProduct": {
            // You can still return a totally new array if you prefer
            return draft.filter(item => item.id !== action.payload.id);
        }

        case "deleteAllProduct": {
            return [];
        }
        
        // No default case needed, Immer returns the draft state automatically
    }
});

export default cartReducer;