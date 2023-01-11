import { CSSObject } from "@emotion/react";
import { ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";

export interface ThemeV1 extends ThemeSeedV1 {
  smallSheetRootStyle: CSSObject;
  tabActiveStyle: CSSObject;
  tabStyle: CSSObject;
  panelStylePrimary: CSSObject;
  panelStyleSecondary: CSSObject;

  colors: ThemeSeedV1["colors"] & {
    bgOpaquePrimary: string;
    bgOpaqueSecondary: string;
    bgTransDangerPrimary: string;
    bgTransDangerSecondary: string;
    bgOpaqueDangerPrimary: string;
    bgOpaqueDangerSecondary: string;
    controlBorder: string;
  };

  logo: ThemeSeedV1["logo"] & {
    fontScaleFactor: number;
  };
}
