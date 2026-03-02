import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TiptapEditor from "@/components/editors/tiptap";
import LiveCodeEditor from "@/components/editors/code-editor";
import { EquationEditor } from "@/components/editors/equation-editor";
import FlowChart from "@/components/editors/flow-chart";
// import FlowDiagram from "@/components/editors/flow-diagram";

const Editor = () => {
  const [value, setValue] = React.useState("**Hello world!**");
  const [htmlValue, setHtmlValue] = React.useState("<p>Hello world!</p>");

  return (
    <div className="w-full h-full p-2 sm:p-4 overflow-hidden">
      <Tabs defaultValue="markdown" className="w-full h-full flex flex-col">
        <TabsList className="w-full overflow-x-auto shrink-0 justify-start h-9 sm:h-10">
          <TabsTrigger
            value="markdown"
            className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Markdown</span>
            <span className="sm:hidden">MD</span>
          </TabsTrigger>
          <TabsTrigger
            value="richtext"
            className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Rich Text</span>
            <span className="sm:hidden">Text</span>
          </TabsTrigger>
          <TabsTrigger
            value="html"
            className="hidden md:inline-flex text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
          >
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="equation"
            className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Equation</span>
            <span className="sm:hidden">Eq</span>
          </TabsTrigger>
          <TabsTrigger
            value="flowchart"
            className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Flow Chart</span>
            <span className="sm:hidden">Flow</span>
          </TabsTrigger>
          {/* <TabsTrigger value="flowdiagram">Flow Diagram</TabsTrigger> */}
        </TabsList>

        <TabsContent value="markdown" className="flex-1 mt-2 sm:mt-4 min-h-0">
          <div data-color-mode="light" className="h-full w-full">
            <MDEditor
              value={value}
              preview="edit"
              height="calc(100vh - 220px)"
              className="!w-full"
              onChange={(val) => setValue(val || "")}
            />
          </div>
        </TabsContent>

        <TabsContent value="richtext" className="flex-1 mt-2 sm:mt-4 min-h-0 overflow-hidden">
          <div className="h-[calc(100vh-220px)] w-full overflow-hidden">
            <TiptapEditor content={htmlValue} onChange={setHtmlValue} />
          </div>
        </TabsContent>

        <TabsContent value="html" className="flex-1 mt-2 sm:mt-4 min-h-0">
          <div className="h-[calc(100vh-220px)] w-full overflow-hidden">
            <LiveCodeEditor />
          </div>
        </TabsContent>

        <TabsContent value="equation" className="flex-1 mt-2 sm:mt-4 min-h-0">
          <div className="h-[calc(100vh-220px)] w-full overflow-hidden">
            <EquationEditor />
          </div>
        </TabsContent>

        <TabsContent value="flowchart" className="flex-1 mt-2 sm:mt-4 min-h-0">
          <div className="h-[calc(100vh-220px)] w-full overflow-hidden">
            <FlowChart />
          </div>
        </TabsContent>

        {/* <TabsContent value="flowdiagram" className="h-full">
          <FlowDiagram />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Editor;
