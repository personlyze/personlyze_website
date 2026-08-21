import { createContext, useContext } from "react";

const BookDemoModalContext = createContext(undefined);

export function useBookDemoModal() {
  const context = useContext(BookDemoModalContext);

  if (context === undefined) {
    throw new Error(
      "useBookDemoModal must be used within a BookDemoModalProvider"
    );
  }

  return context;
}

export default BookDemoModalContext;
