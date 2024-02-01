import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";

type MagicToolbarContent = Record<string, ReactNode>;
type MagicToolBarRegister = (id: string, content: ReactNode) => void;
type MagicToolBarUnregister = (id: string) => void;
type MagicToolbarRegisterContext = {
  register: MagicToolBarRegister;
  unregister: MagicToolBarUnregister;
};

// -----------------------------------------------------------------------------
// PROVIDER

export const MagicToolbarContentContext =
  React.createContext<MagicToolbarContent>({});

export const MagicToolbarRegisterContext =
  React.createContext<MagicToolbarRegisterContext>({
    register: () => {},
    unregister: () => {},
  });

interface MagicToolbarProviderProps extends React.PropsWithChildren {}

export const MagicToolbarProvider: React.FC<MagicToolbarProviderProps> = ({
  children,
}) => {
  const [content, setContent] = useState<MagicToolbarContent>({});

  const register = useCallback((id: string, content: ReactNode) => {
    setContent((prev) => ({ ...prev, [id]: content }));
  }, []);

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
};

MagicToolbarProvider.displayName = "MagicToolbarProvider";

// -----------------------------------------------------------------------------
// CONTENT ELEMENT

interface MagicToolbarContentProps extends React.PropsWithChildren {}

export const MagicToolbarContent: React.FC<MagicToolbarContentProps> = ({
  children,
}) => {
  const id = useId();

  const { register, unregister } = useContext(MagicToolbarRegisterContext);

  useEffect(() => {
    register(id, children);
    return () => {
      unregister(id);
    };
  }, [children, id, register, unregister]);

  return null;
};

MagicToolbarContent.displayName = "MagicToolbarContent";

// -----------------------------------------------------------------------------
// TOOLBAR

export const MagicToolbar: React.FC = () => {
  const content = Object.values(useContext(MagicToolbarContentContext));
  return (
    <div css={{ display: "flex", flexDirection: "row", gap: "0.5em" }}>
      {content}
    </div>
  );
};

MagicToolbar.displayName = "MagicToolbar";
