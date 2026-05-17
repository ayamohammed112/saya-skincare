import { createContext, useContext, useReducer, useState, useRef } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const qty = action.item.qty || 1
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...state, { ...action.item, qty }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      if (action.qty < 1) return state.filter(i => i.id !== action.id)
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const addItem = (item) => {
    dispatch({ type: 'ADD', item })
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(item)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }
  const removeItem = (id) => dispatch({ type: 'REMOVE', id })
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, toast }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
