declare const Babele: any;

// DSN uses this extra dice term option to sequence rolls
declare namespace RollTerm {
  interface Options {
    rollOrder?: number;
  }
}

declare namespace PopOut {
  interface DialogHookInfo {
    /** the parent app */
    app: Application;
    children: Array<any>;
    close: () => void;
    css: string;
    display: string;
    handle: string;
    header: HTMLElement;
    maximize: () => void;
    minimize: () => void;
    minimized: boolean;
    node: HTMLElement;
    position: {
      width: number;
      height: number;
      left: number;
      scale: number;
      top: number;
      zIndex: number;
    };
    /** unknown - signature probably wrong */
    render: () => void;
    window: Window;
  }
}

declare namespace foundry {
  namespace applications {
    namespace api {
      class ApplicationV2 {
        constructor(options: Partial<ApplicationConfiguration>);
        // properties
        options: ApplicationConfiguration;
        position: ApplicationPosition;
        static BASE_APPLICATION: typeof ApplicationV2;
        static DEFAULT_OPTIONS: Omit<ApplicationConfiguration, "uniqueId">;
        static RENDER_STATES: Readonly<{
          ERROR: -3;
          CLOSING: -2;
          CLOSED: -1;
          NONE: 0;
          RENDERING: 1;
          RENDERED: 2;
        }>;

        // accessors
        get window(): {
          title: HTMLHeadingElement;
          icon: HTMLElement;
          close: HTMLButtonElement;
          controls: HTMLButtonElement;
          controlsDropdown: HTMLDivElement;
          onDrag: (...args: any[]) => any;
          dragStartPosition: ApplicationPosition;
          dragTime: number;
        };

        get classList(): DOMTokenList;

        get id(): string;

        get title(): string;

        get element(): HTMLElement;

        get minimized(): boolean;

        get rendered(): boolean;

        get state(): keyof typeof ApplicationV2.RENDER_STATES;

        get hasFrame(): boolean;

        // methods

        render(
          options: boolean | Partial<ApplicationRenderOptions>,
          _options?: Partial<ApplicationRenderOptions>,
        ): Promise<ApplicationV2>;

        _renderHTML(
          context: any,
          options: ApplicationRenderOptions,
        ): Promise<HTMLElement | HTMLCollection>;

        _replaceHTML(
          result: any,
          content: HTMLElement,
          options: ApplicationRenderOptions,
        ): void;

        close(options?: any): Promise<ApplicationV2>;

        setPosition(
          position?: Partial<ApplicationPosition>,
        ): ApplicationPosition;

        toggleControls(expanded?: boolean): void;

        minimize(): Promise<void>;

        maximize(): Promise<void>;

        _awaitTransition(element: HTMLElement, timeout: number): Promise<void>;

        // addEventListener(type: string, listener: EmittedEventListener, options?): void
        addEventListener(
          type: string,
          listener: (event: Event) => void,
          options?: Partial<{
            once: boolean;
          }>,
        ): void;

        removeEventListener(
          type: string,
          listener: (event: Event) => void,
        ): void;

        dispatchEvent(event: Event): boolean;

        static inheritanceChain(): Generator<
          typeof ApplicationV2,
          void,
          unknown
        >;

        parseCSSDimension(style: string, parentDimension: number): number;
      }
    }
    interface ApplicationRenderOptions {
      force: boolean;
      position: ApplicationPosition;
      window: ApplicationWindowRenderOptions;
      parts: string[];
    }
    interface ApplicationWindowRenderOptions {
      title: string;
      icon: string | false;
      controls: boolean;
    }
    interface ApplicationConfiguration {
      id: string;
      uniqueId: string;
      classes: string[];
      tag: string;
      window: ApplicationWindowConfiguration;
      actions: Record<string, ApplicationClickAction>;
      position: Partial<ApplicationPosition>;
    }
    interface ApplicationWindowConfiguration {
      frame: boolean;
      positioned: boolean;
      title: string;
      icon: string | false;
      controls: ApplicationHeaderControlsEntry[];
      minimizable: boolean;
    }
    interface ApplicationHeaderControlsEntry {
      icon: string;
      label: string;
      action: string;
      visible: boolean;
    }
    interface ApplicationPosition {
      top: number;
      left: number;
      width: number | "auto";
      height: number | "auto";
      scale: number;
      zIndex: number;
    }
    type ApplicationClickAction = (event: any, target: any) => any;
    namespace types {}
  }
}
