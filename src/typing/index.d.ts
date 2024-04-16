type ObjToKeyValArray<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

/* Menu */
declare namespace Menu {
    interface MenuOptions {
      path: string;
      name: string;
      component?: string | (() => Promise<unknown>);
      redirect?: string;
      meta: MetaProps;
      children?: MenuOptions[];
    }
    interface MetaProps {
      icon: string;
      title: string;
      activeMenu?: string;
      isLink?: string;
      isHide: boolean;
      isFull: boolean;
      isAffix: boolean;
      isKeepAlive: boolean;
    }
}

declare namespace NodeJS {
  interface ProcessEnv {
    VUE_APP_ROUTER_MODE: 'hash' | 'history';
    // 添加其他需要的环境变量声明
  }
}

declare module 'import.meta' {
  interface ImportMeta {
    glob: (specifier: string) => Record<string, () => Promise<any>>;
  }
}

/* FileType */
declare namespace File {
  type ImageMimeType =
    | "image/apng"
    | "image/bmp"
    | "image/gif"
    | "image/jpeg"
    | "image/pjpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/tiff"
    | "image/webp"
    | "image/x-icon";

  type ExcelMimeType = "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

// types/FBXFileTypes.ts
declare namespace FBXFile {
  type MimeType = "application/octet-stream";

  interface File extends globalThis.File {
    type: MimeType;
  }
}