import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { ImageArea } from "./ImageArea";

interface ImageEditorProps {
  page: any;
}

/**
 * A basic image page. Delegates to Foundry's native editor to do the heavy
 * lifting.
 */
export const ImageEditor = ({ page }: ImageEditorProps) => {
  return (
    <div
      css={{
        ...absoluteCover,
        display: "grid",
        gridTemplateColumns: "1fr 1fr ",
        gridTemplateRows: "1fr",
      }}
    >
      <ImageArea page={page} />
      <InputGrid css={{ padding: "0.5em" }}>
        <GridFieldStacked label="Caption" noTranslate>
          <AsyncTextInput
            value={page.caption}
            onChange={page.setCaption}
            css={{ flex: 1 }}
          />
        </GridFieldStacked>
      </InputGrid>
    </div>
  );
};

ImageEditor.displayName = "ImageEditor";
