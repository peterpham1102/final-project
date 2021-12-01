import * as React from "react";
import useLocalStorage from "./useLocalStorage";
export const initialState = {
    items: [],
    isEmpty: true,
    totalItems: 0,
    totalUniqueItems: 0,
    cartTotal: 0,
    metadata: {},
};
const CartContext = React.createContext(initialState);
export const createCartIdentifier = (len = 12) => [...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("");
export const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context)
        throw new Error("Expected to be wrapped in a CartProvider");
    return context;
};
function reducer(state, action) {
    switch (action.type) {
        case "SET_ITEMS":
            return generateCartState(state, action.payload);
        case "ADD_ITEM": {
            const items = [...state.items, action.payload];
            return generateCartState(state, items);
        }
        case "UPDATE_ITEM": {
            const items = state.items.map((item) => {
                if (item.id !== action.id)
                    return item;
                return Object.assign(Object.assign({}, item), action.payload);
            });
            return generateCartState(state, items);
        }
        case "REMOVE_ITEM": {
            const items = state.items.filter((i) => i.id !== action.id);
            return generateCartState(state, items);
        }
        case "EMPTY_CART":
            return initialState;
        case "CLEAR_CART_META":
            return Object.assign(Object.assign({}, state), { metadata: {} });
        case "SET_CART_META":
            return Object.assign(Object.assign({}, state), { metadata: Object.assign({}, action.payload) });
        case "UPDATE_CART_META":
            return Object.assign(Object.assign({}, state), { metadata: Object.assign(Object.assign({}, state.metadata), action.payload) });
        default:
            throw new Error("No action specified");
    }
}
const generateCartState = (state = initialState, items) => {
    const totalUniqueItems = calculateUniqueItems(items);
    const isEmpty = totalUniqueItems === 0;
    return Object.assign(Object.assign(Object.assign({}, initialState), state), { items: calculateItemTotals(items), totalItems: calculateTotalItems(items), totalUniqueItems, cartTotal: calculateTotal(items), isEmpty });
};
const calculateItemTotals = (items) => items.map(item => (Object.assign(Object.assign({}, item), { itemTotal: item.price * item.quantity })));
const calculateTotal = (items) => items.reduce((total, item) => total + item.quantity * item.price, 0);
const calculateTotalItems = (items) => items.reduce((sum, item) => sum + item.quantity, 0);
const calculateUniqueItems = (items) => items.length;
export const CartProvider = ({ children, id: cartId, defaultItems = [], onSetItems, onItemAdd, onItemUpdate, onItemRemove, storage = useLocalStorage, metadata, }) => {
    // const id = cartId ? cartId : createCartIdentifier();
    const id = cartId ? cartId : createCartIdentifier();
    // const [savedCart, saveCart] = storage(cartId ? `react-use-cart-${id}` : `react-use-cart`, JSON.stringify(Object.assign(Object.assign({ id }, initialState), { items: defaultItems, metadata })));
    const [savedCart, saveCart] = storage(cartId ? `react-use-cart-${id}` : `react-use-cart`, JSON.stringify(Object.assign(Object.assign({ id }, initialState), { items: defaultItems, metadata })));
    
    const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedCart));
    React.useEffect(() => {
        saveCart(JSON.stringify(state));
    }, [state, saveCart]);
    const setItems = (items) => {
        dispatch({
            type: "SET_ITEMS",
            payload: items.map(item => (Object.assign(Object.assign({}, item), { quantity: item.quantity || 1 }))),
        });
        onSetItems && onSetItems(items);
    };
    const addItem = (item, quantity = 1) => {
        if (!item.id)
            throw new Error("You must provide an `id` for items");
        if (quantity <= 0)
            return;
        const currentItem = state.items.find((i) => i.id === item.id);
        if (!currentItem && !item.hasOwnProperty("price"))
            throw new Error("You must pass a `price` for new items");
        if (!currentItem) {
            const payload = Object.assign(Object.assign({}, item), { quantity });
            dispatch({ type: "ADD_ITEM", payload });
            onItemAdd && onItemAdd(payload);
            return;
        }
        const payload = Object.assign(Object.assign({}, item), { quantity: currentItem.quantity + quantity });
        dispatch({
            type: "UPDATE_ITEM",
            id: item.id,
            payload,
        });
        onItemUpdate && onItemUpdate(payload);
    };
    const updateItem = (id, payload) => {
        if (!id || !payload) {
            return;
        }
        dispatch({ type: "UPDATE_ITEM", id, payload });
        onItemUpdate && onItemUpdate(payload);
    };
    const updateItemQuantity = (id, quantity) => {
        if (quantity <= 0) {
            onItemRemove && onItemRemove(id);
            dispatch({ type: "REMOVE_ITEM", id });
            return;
        }
        const currentItem = state.items.find((item) => item.id === id);
        if (!currentItem)
            throw new Error("No such item to update");
        const payload = Object.assign(Object.assign({}, currentItem), { quantity });
        dispatch({
            type: "UPDATE_ITEM",
            id,
            payload,
        });
        onItemUpdate && onItemUpdate(payload);
    };
    const removeItem = (id) => {
        if (!id)
            return;
        dispatch({ type: "REMOVE_ITEM", id });
        onItemRemove && onItemRemove(id);
    };
    const emptyCart = () => dispatch({
        type: "EMPTY_CART",
    });
    const getItem = (id) => state.items.find((i) => i.id === id);
    const inCart = (id) => state.items.some((i) => i.id === id);
    const clearCartMetadata = () => {
        dispatch({
            type: "CLEAR_CART_META",
        });
    };
    const setCartMetadata = (metadata) => {
        if (!metadata)
            return;
        dispatch({
            type: "SET_CART_META",
            payload: metadata,
        });
    };
    const updateCartMetadata = (metadata) => {
        if (!metadata)
            return;
        dispatch({
            type: "UPDATE_CART_META",
            payload: metadata,
        });
    };
    return (React.createElement(CartContext.Provider, { value: Object.assign(Object.assign({}, state), { getItem,
            inCart,
            setItems,
            addItem,
            updateItem,
            updateItemQuantity,
            removeItem,
            emptyCart,
            clearCartMetadata,
            setCartMetadata,
            updateCartMetadata }) }, children));
};

