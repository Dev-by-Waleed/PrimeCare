function cartReducer(state, action) {
    switch (action.type) {
        case "addProduct":
            // Check if the item already exists in the cart
            const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
            
            // Extract the quantity being added, default to 1 just in case
            const quantityToAdd = action.payload.quantity || 1;
            
            if (existingItemIndex >= 0) {
                // If it exists, copy the state and add the incoming quantity to the existing quantity
                const newState = [...state];
                newState[existingItemIndex] = {
                    ...newState[existingItemIndex],
                    quantity: (newState[existingItemIndex].quantity || 0) + quantityToAdd
                };
                return newState;
            } else {
                // If it's a new item, add it to the array with the requested quantity
                return [...state, { ...action.payload, quantity: quantityToAdd }];
            }

        case "deleteProduct":
            // Assuming action.payload is the whole product object
            return state.filter(item => item.id !== action.payload.id); 

        case "deleteAllProduct":    
            return [];

        default:
            return state;
    }
}

export default cartReducer;