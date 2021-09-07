/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { ThemeContext } from "../../theme";
import { useResizeDetector } from "react-resize-detector";
import ReactDOM from "react-dom";

type LogoEditableProps = {
  text: string,
  subtext?: string,
  defaultSubtext?: string,
  className?: string,
  onChangeText: (newValue: string) => void,
  onChangeSubtext: (newValue: string) => void,
};

const subtextSyle: CSSObject = {
  fontSize: "0.5em",
  padding: "0",
  minHeight: "1em",
};

const textBearerStyle: CSSObject = {
  color: "transparent",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const transformRootStyle: CSSObject = {
  display: "block",
  position: "relative",
  height: "6em",
  width: "auto",
  perspective: "500px",
  perspectiveOrigin: "50% 50%",
  textAlign: "center",
};

/**
 * Outrageously overengineered editable logo
 */
export const LogoEditable: React.FC<LogoEditableProps> = ({
  text,
  subtext: subtextOrig,
  defaultSubtext = "Investigator",
  className,
  onChangeText: onChangeTextOrig,
  onChangeSubtext: onChangeSubtextOrig,
}) => {
  const subtext = (subtextOrig ?? "").trim();

  const textStyle: CSSObject = {
    transition: "font-size 500ms",
    padding: "0",
  };

  // all the editing logic is done in the hook
  const {
    onInput: onInputText,
    onFocus: onFocusText,
    onBlur: onBlurText,
    contentEditableRef: contentEditableRefText,
    display: displayText,
  } = useAsyncUpdate(text, onChangeTextOrig);

  const {
    onInput: onInputSubtext,
    onFocus: onFocusSubtext,
    onBlur: onBlurSubtext,
    contentEditableRef: contentEditableRefSubtext,
    display: displaySubtext,
  } = useAsyncUpdate(subtext || defaultSubtext, onChangeSubtextOrig);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: naturalWidth, height: naturalHeight, ref: naturalSizeDetectorRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 300,
    observerOptions: {
      // box: "device-pixel-content-box",
    },
    // onResize,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [domRect, setDomRect] = useState<DOMRect|null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      const newDomRect = naturalSizeDetectorRef.current?.getBoundingClientRect() ?? null;
      setDomRect(newDomRect);
    }, 500);
    return () => {
      clearTimeout(id);
    };
  }, [naturalSizeDetectorRef]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: availableWidth, height: availableHeight, ref: availableSizeDetectorRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 300,
    // onResize,
  });

  const theme = useContext(ThemeContext);

  const transformStyle: CSSObject = {
    font: theme.displayFont,
    fontSize: "4em",
    whiteSpace: "nowrap",
    transform: theme.logoTransform,
    caretColor: "black",
    border: "none",
    padding: 0,
    lineHeight: 1,
  };

  let scaleFactor = 1;

  if (
    domRect !== null &&
    naturalWidth !== undefined &&
    naturalHeight !== undefined &&
    naturalWidth !== 0 &&
    naturalHeight !== 0 &&
    availableWidth !== undefined &&
    availableHeight !== undefined
  ) {
    const widthFactor = availableWidth / domRect.width;
    const heightFactor = availableHeight / domRect.height;
    scaleFactor = Math.min(widthFactor, heightFactor);
    console.log(`
      naturalWidth: ${naturalWidth}
      naturalHeight: ${naturalHeight}
      availableWidth: ${availableWidth}
      availableHeight: ${availableHeight}
      widthFactor: ${widthFactor}
      heightFactor: ${heightFactor}
      scaleFactor: ${scaleFactor}
    `, domRect);
  } else {
    console.log("scaleFactor defaulted to 1");
  }

  return (

    <Fragment>
      {/* Resize detector */}
      {ReactDOM.createPortal(
        <div
        className="size-sampler-root"
        css={{
          ...transformRootStyle,
          position: "absolute",
          zIndex: 1000,
          // visibility: "hidden",
        }}
        >
          {/* inner - apply the transform */}
          <div
            ref={naturalSizeDetectorRef}//
            className="size-sample-transform"
            css={{
              background: "#ff77",
              ...transformStyle,
            }}
          >
            <div
              css={{
                ...textStyle,
              }}
            >
              {displayText}
            </div>
            {subtext !== undefined &&
              <div
                css={{
                  ...subtextSyle,
                }}
              >
                {displaySubtext}
              </div>
            }
          </div>
        </div>,
        document.body,
      )}

      {/* actual render starts here */}

      {/* outer - set the transform origin */}
      <div
        ref={availableSizeDetectorRef}
        className={`transform-root ${className}`}
        css={{
          ...transformRootStyle,
          transform: `scale(${scaleFactor},${scaleFactor})`,
        }}
      >
        {/* Backdrop */}
        <div
          className="logo-backdrop"
          css={{
            ...theme.logoBackdropStyle,
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
        {/* middle - apply scaling */}
        {/* <div
          css={{
          }}
        > */}
          {/* inner - apply the transform */}
          <div
            className="inner-block"
            css={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              ...transformStyle,
            }}
          >
            {/* shadow-bearer */}
            <div
              className="shadow-bearer"
              css={{
                zIndex: -1,
                ...textBearerStyle,
                ...theme.logoRearElementStyle,
              }}
            >
              <div
                css={{
                  ...textStyle,
                }}
              >
                {displayText}
              </div>
              {subtext !== undefined &&
                <div
                  css={{
                    ...subtextSyle,
                  }}
                >
                  {displaySubtext}
                </div>
              }
            </div>

            {/* gradient-bearer */}
            {/* This extra div is SOLELY to work around this Firefox bug
              https://bugzilla.mozilla.org/show_bug.cgi?id=1720995
              Basically if you have transform and background-clip: text on the same
              element it cocks up. Bug was introduced in FF90, and as resolved in
              FF92 so I could have ignored it but then again that's not how I roll.
              I have tested this in FF nightlies and it is 100% fixed in FF92. When
              FF92 hits mainline, it will be safe to come back and unwrap this div
              and just apply textBearerStyle on the gradient-bearer div.
              */}
            <div
              css={textBearerStyle}
            >
              <div
                className="gradient-bearer"
                css={{
                  // When F92 is mainline, unwrap this div and uncomment this style.
                  // ...textBearerStyle,
                  ...theme.logoFrontElementStyle,
                }}
                >
                <div
                  css={{
                    ...textStyle,
                  }}
                  contentEditable
                  ref={contentEditableRefText}
                  onInput={onInputText}
                  onFocus={onFocusText}
                  onBlur={onBlurText}
                  />
                {subtext !== undefined &&
                  <div
                  css={{
                    ...subtextSyle,
                  }}
                  contentEditable
                  ref={contentEditableRefSubtext}
                  onInput={onInputSubtext}
                  onFocus={onFocusSubtext}
                  onBlur={onBlurSubtext}
                  />
                }
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    </Fragment>
  );
};
