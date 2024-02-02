import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import { Toolbar } from "./Toolbar";

type MagicToolbarContentEntry = {
  sort: number;
  content: ReactNode;
};
type MagicToolbarContent = Record<string, MagicToolbarContentEntry>;
type MagicToolBarRegister = (
  id: string,
  content: MagicToolbarContentEntry,
) => void;
type MagicToolBarUnregister = (id: string) => void;
type MagicToolbarRegisterContext = {
  register: MagicToolBarRegister;
  unregister: MagicToolBarUnregister;
};

// -----------------------------------------------------------------------------
// PROVIDER COMPONENT

const MagicToolbarContentContext = React.createContext<MagicToolbarContent>({});

const MagicToolbarRegisterContext =
  React.createContext<MagicToolbarRegisterContext>({
    register: () => {},
    unregister: () => {},
  });

interface MagicToolbarProviderProps extends React.PropsWithChildren {}

/**
 * Provides the context for the magic toolbar content.
 */
export const MagicToolbarProvider = React.memo<MagicToolbarProviderProps>(
  ({ children }) => {
    const [content, setContent] = useState<MagicToolbarContent>({});

    const register = useCallback(
      (id: string, content: MagicToolbarContentEntry) => {
        setContent((prev) => ({ ...prev, [id]: content }));
      },
      [],
    );

    const unregister = useCallback((id: string) => {
      setContent((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, []);

    return (
      <MagicToolbarRegisterContext.Provider value={{ register, unregister }}>
        <MagicToolbarContentContext.Provider value={content}>
          {children}
        </MagicToolbarContentContext.Provider>
      </MagicToolbarRegisterContext.Provider>
    );
  },
);

MagicToolbarProvider.displayName = "MagicToolbarProvider";

// -----------------------------------------------------------------------------
// CONTENT HOOK

/**
 * Register content with the magic toolbar. HIGHLY recommended to use `useMemo`
 * inside the call to this hook to stabilise the content.
 */
export function useToolbarContent(content: ReactNode, sort: number = 0) {
  // const content = useMemo(contentFn, []);

  const id = useId();

  const { register, unregister } = useContext(MagicToolbarRegisterContext);

  const contentObject = useMemo<MagicToolbarContentEntry>(
    () => ({ sort, content }),
    [content, sort],
  );

  useEffect(() => {
    register(id, contentObject);
    return () => {
      unregister(id);
    };
  }, [content, contentObject, id, register, unregister]);
}

// -----------------------------------------------------------------------------
// TOOLBAR COMPONENT

interface MagicToolbarProps extends React.PropsWithChildren {}

/**
 * Render the actual toolbar. Children content will be rendered first. If you
 * want to provide more content woth sorting options, use a samll wrapper
 * component which calls useToolbarContent.
 */
export const MagicToolbar: React.FC<MagicToolbarProps> = ({ children }) => {
  const content = Object.values(useContext(MagicToolbarContentContext))
    .sort((a, b) => a.sort - b.sort)
    .map((c) => c.content);
  return (
    <Toolbar>
      {children}
      {content}
    </Toolbar>
  );
};

MagicToolbar.displayName = "MagicToolbar";
