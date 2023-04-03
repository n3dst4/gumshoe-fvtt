import React, { Fragment, useCallback, useContext, useState } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { ImagePickerLink } from "./ImagePickerLink";

const cover = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
} as const;

const transitionTime = "0.3s";

type ImagePickleProps = {
  subject: Actor | Item;
  application: DocumentSheet;
  className?: string;
};

export const ImagePickle: React.FC<ImagePickleProps> = ({
  subject,
  application,
  className,
}: ImagePickleProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const theme = useContext(ThemeContext);

  const onClickEdit = useCallback(() => {
    setShowOverlay(false);
    const fp = new FilePicker({
      type: "image",
      // XXXV10 added the ?? undefined
      current: subject.img ?? undefined,
      callback: (path: string) => {
        subject.update({
          img: path,
        });
      },
      top: (application.position.top ?? 0) + 40,
      left: (application.position.left ?? 0) + 10,
    });
    return fp.browse(subject.img ?? "");
  }, [application.position.left, application.position.top, subject]);

  const onClickShow = useCallback(() => {
    setShowOverlay(false);
    const ip = new ImagePopout(subject.img ?? "", {
      title: subject.img,
      shareable: true,
    } as any);
    ip.render(true);
  }, [subject.img]);

  const onClickCancel = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const onClickImage = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      setShowOverlay(true);
      const clickListener = () => {
        setShowOverlay(false);
      };
      document.addEventListener("click", clickListener);

      return () => {
        document.removeEventListener("click", clickListener);
      };
    },
    [],
  );

  return (
    <div
      className={className}
      css={{
        borderRadius: "0.2em",
        boxShadow: "0em 0em 0.5em 0.1em rgba(0,0,0,0.5)",
        position: "relative",
      }}
      onClick={(e) => onClickImage(e)}
    >
      <div
        css={{
          ...cover,
          overflow: "hidden",
        }}
      >
        <div
          css={{
            ...cover,
            backgroundImage: `url("${subject.data.img}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: showOverlay ? "blur(0.7em)" : undefined,
            transition: `filter ${transitionTime} ease-in`,
          }}
        />
      </div>

      <div
        css={{
          ...cover,
          opacity: showOverlay ? 1 : 0,
          transition: `opacity ${transitionTime} ease-in`,
          background: theme.colors.backgroundSecondary,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {showOverlay && (
          <Fragment>
            <ImagePickerLink onClick={onClickShow}>Show</ImagePickerLink>
            <ImagePickerLink onClick={onClickEdit}>Edit</ImagePickerLink>
            <ImagePickerLink onClick={onClickCancel}>Cancel</ImagePickerLink>
          </Fragment>
        )}
      </div>
    </div>
  );
};
