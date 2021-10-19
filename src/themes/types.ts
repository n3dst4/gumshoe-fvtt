import { CSSObject, SerializedStyles } from "@emotion/react";

export type ThemeSeed = {
  schemaVersion: "v1",
  /** The name of the theme. Use puns and allusions liberally. */
  displayName: string,
  /**
   * CSS block which will be inserted at the top of the browser document. This
   * is a good place for `@import` directives for loading fonts.
   */
  global?: SerializedStyles,
  /**
   * Will be applied to the root element of the themed area. This is a good
   * place to apply a wallpaper image.
   */
  largeSheetRootStyle: CSSObject,
  /**
   * Will be applied to the root element of the themed area. This is a good
   * place to apply a wallpaper image.
   * @default largeSheetRootStyle
   */
  smallSheetRootStyle?: CSSObject,
  /**
   * If defined, these styles will be added to the app window for any <CSSReset>
   * unless `noStyleAppWindow` is given.
   */
  appWindowStyle?: CSSObject,
  /**
   * Font string for block text.
   */
  bodyFont?: string,
  /**
   * Font string for title or label text.
   */
  displayFont?: string,
  /**
   * Styles for the fancy character sheet logo. See the LogoEditable component
   * for details.
   */
  logo: {
    /**
     * These styles will be applied to the front text element, so you can do the
     * `background-clip: text; color: transparent;` trick to get gradient (or
     * other image) text.
     */
    frontTextElementStyle: CSSObject,
    /**
     * These styles will be applied to the rear text element. This is a good
     * place to add drop shadows because if you put them on the front element
     * while doing the `background-clip: text; color: transparent;` trick the
     * shadow will show through the text 🥺
     */
    rearTextElementStyle: CSSObject,
    /**
     * These styles will be applied to both text elements at once (actually to a
     * wrapper around them. This is a good place to apply `transform`s.
     */
    textElementsStyle: CSSObject,
    /**
     * These styles will be applied to the otherwise-empty div that goes behind
     * the text elements.
     */
    backdropStyle: CSSObject,
  },

  /**
   * All the values in this collection should be parseable as CSS colors
   */
  colors: {
    accent: string,
    accentContrast: string,
    glow: string,
    danger?: string,
    wallpaper: string,
    text: string,
    /**
     * should work alongside `text` and `textMuted`
     */
    bgTint: string,

    /**
     * The contract for this color is: if you layer this color over the
     * `rootElementStyle` or the `wallpaper` color, you will get a surface which
     * can be use to mount text in either the `text`, `textMuted`, or `accent`
     * colors.
     */
    bgTransPrimary: string,

    /**
     * The contract for this color is: see @bgTransPrimary, but visually
     * distinct.
     */
    bgTransSecondary: string,

  },
}

export type Theme = ThemeSeed & {
  smallSheetRootStyle: CSSObject,

  colors: ThemeSeed["colors"] & {
    bgOpaquePrimary: string,
    bgOpaqueSecondary: string,
    bgTransDangerPrimary: string,
    bgTransDangerSecondary: string,
    bgOpaqueDangerPrimary: string,
    bgOpaqueDangerSecondary: string,
  },
}
