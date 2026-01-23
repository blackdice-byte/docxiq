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
    <div className="w-full h-full p-2 sm:p-4">
      <Tabs defaultValue="markdown" className="w-full h-full flex flex-col">
        <TabsList className="w-full overflow-x-auto flex-shrink-0 justify-start">
          <TabsTrigger
            value="markdown"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Markdown
          </TabsTrigger>
          <TabsTrigger
            value="richtext"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Rich Text
          </TabsTrigger>
          <TabsTrigger
            value="html"
            className="hidden md:inline-flex text-xs sm:text-sm whitespace-nowrap"
          >
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="equation"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Equation
          </TabsTrigger>
          <TabsTrigger
            value="flowchart"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Flow Chart
          </TabsTrigger>
          {/* <TabsTrigger value="flowdiagram">Flow Diagram</TabsTrigger> */}
        </TabsList>

        <TabsContent value="markdown" className="flex-1 mt-2 sm:mt-4">
          <MDEditor
            value={value}
            preview="edit"
            height="calc(100vh - 200px)"
            onChange={(val) => setValue(val || "")}
          />
        </TabsContent>

        <TabsContent value="richtext" className="flex-1 mt-2 sm:mt-4">
          <TiptapEditor content={htmlValue} onChange={setHtmlValue} />
        </TabsContent>

        <TabsContent value="html" className="flex-1 mt-2 sm:mt-4">
          <LiveCodeEditor />
        </TabsContent>

        <TabsContent value="equation" className="flex-1 mt-2 sm:mt-4">
          <EquationEditor />
        </TabsContent>

        <TabsContent value="flowchart" className="flex-1 mt-2 sm:mt-4">
          <FlowChart />
        </TabsContent>

        {/* <TabsContent value="flowdiagram" className="h-full">
          <FlowDiagram />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Editor;
