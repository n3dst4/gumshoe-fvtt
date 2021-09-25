/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";

type ImagePickleProps = {
  document: Actor | Item,
  application: DocumentSheet,
  className?: string,
  editMode: boolean,
};

export const ImagePickle: React.FC<ImagePickleProps> = ({
  document,
  application,
  className,
  editMode,
}: ImagePickleProps) => {
  const onImageClick = useCallback(() => {
    if (editMode) {
      const fp = new FilePicker({
        type: "image",
        current: document.data.img,
        callback: (path: string) => {
          document.update({
            img: path,
          });
        },
        top: (application.position.top ?? 0) + 40,
        left: (application.position.left ?? 0) + 10,
      });
      return fp.browse();
    } else {
      const ip = new ImagePopout(document.data.img, {
        title: document.data.name,
        shareable: true,
        // entity: document,
      } as any);

      // Display the image popout
      ip.render(true);
    }
  }, [application.position.left, application.position.top, document, editMode]);

  return (
    <div
      className={className}
      css={{
        gridArea: "image",
        transform: "rotateZ(2deg)",

        backgroundImage: `url("${document.data.img}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "0.2em",
        boxShadow: "0em 0em 0.5em 0.1em rgba(0,0,0,0.5)",
      }}
      onClick={onImageClick}
    />
  );
};
