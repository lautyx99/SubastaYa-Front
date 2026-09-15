import { createContext, useContext, useState, useCallback } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, variant = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, variant }])
  }, [])

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 2000 }}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            onClose={() => remove(t.id)}
            show
            delay={4000}
            autohide
          >
            <Toast.Body className={t.variant === 'success' || t.variant === 'danger' ? 'text-white' : ''}>
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)