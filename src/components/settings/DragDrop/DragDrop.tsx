import { TabContainer } from "../../TabContainer";
import { Experiment1 } from "./Experiment1";
import { SortableTest } from "./SortableTest";

export const DragDrop = () => {
  return (
    <TabContainer
      defaultTab="SortableTest"
      tabs={[
        {
          id: "Experiment1",
          label: "Experiment 1",
          content: <Experiment1 />,
          translate: false,
        },
        {
          id: "SortableTest",
          label: "Sortable Test",
          content: <SortableTest />,
          translate: false,
        },
      ]}
    />
  );
};
