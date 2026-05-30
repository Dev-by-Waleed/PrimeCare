function cartReducer(state, action) {
    switch (action.type) {
        case "addProduct":
            // Check if the item already exists in the cart
            const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
            
            if (existingItemIndex >= 0) {
                // If it exists, copy the state and increment the quantity
                const newState = [...state];
                newState[existingItemIndex] = {
                    ...newState[existingItemIndex],
                    quantity: (newState[existingItemIndex].quantity || 1) + 1
                };
                return newState;
            } else {
                // If it's a new item, add it to the array with a quantity of 1
                return [...state, { ...action.payload, quantity: 1 }];
            }

        case "deleteProduct":
            // Assuming action.payload is the whole product object (from your Cart component)
            return state.filter(item => item.id !== action.payload.id); 

        case "deleteAllProduct":    
            return [];

        default:
            return state;
    }
}

export default cartReducer;