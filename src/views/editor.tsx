import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Editor = () => {
  const [value, setValue] = React.useState("**Hello world!**");

  return (
    <div className="w-full h-full p-4">
      <Tabs defaultValue="markdown" className="w-full h-full">
        <TabsList>
          <TabsTrigger value="markdown">Markdown Editor</TabsTrigger>
          <TabsTrigger value="richtext">Rich Text Editor</TabsTrigger>
          <TabsTrigger value="html">HTML Editor</TabsTrigger>
          <TabsTrigger value="equation">Equation Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="h-full">
          <MDEditor
            value={value}
            preview="edit"
            height="calc(100vh - 180px)"
            onChange={(val) => setValue(val || "")}
          />
        </TabsContent>

        <TabsContent value="richtext" className="h-full">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-[calc(100vh-180px)] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rich text editor (coming soon...)"
          />
        </TabsContent>

        <TabsContent value="html" className="h-full">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-[calc(100vh-180px)] p-4 border border-gray-300 rounded-md resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="<html>...</html>"
          />
        </TabsContent>
        
        <TabsContent value="equation" className="h-full">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-[calc(100vh-180px)] p-4 border border-gray-300 rounded-md resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="<html>...</html>"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Editor;
