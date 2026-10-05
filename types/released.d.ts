// TypeScript declaration for the custom elements and Released API
declare global {
  interface Window {
    Released?: {
      show: (type: string, id: string) => void;
      close: (type: string, id: string) => void;
    };
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "released-page": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "channel-id"?: string;
          "auth-token"?: string;
          "header"?: string;
          "color-scheme"?: string;
          "modules"?: string;
        },
        HTMLElement
      >;
      "released-form": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "form-id"?: string;
          "auth-token"?: string;
          "sub-title"?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
