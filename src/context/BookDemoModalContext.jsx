import { useState, useCallback, useMemo } from "react";
import BookDemoModal from "../components/BookDemoModal/BookDemoModal";
import BookDemoModalContext from "./useBookDemoModal";

export function BookDemoModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBookDemo = useCallback(() => setIsOpen(true), []);
  const closeBookDemo = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openBookDemo, closeBookDemo }),
    [isOpen, openBookDemo, closeBookDemo]
  );

  return (
    <BookDemoModalContext.Provider value={value}>
      {children}
      <BookDemoModal isOpen={isOpen} onClose={closeBookDemo} />
    </BookDemoModalContext.Provider>
  );
}
