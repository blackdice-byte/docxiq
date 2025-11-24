import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 250, y: 5 },
    data: { label: "Start" },
    type: "input",
  },
  { id: "2", position: { x: 250, y: 100 }, data: { label: "Process" } },
  {
    id: "3",
    position: { x: 250, y: 200 },
    data: { label: "End" },
    type: "output",
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: "default" | "input" | "output") => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
      type,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const newLabel = window.prompt("Enter new node name:", node.data.label);
      if (newLabel !== null && newLabel.trim() !== "") {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, label: newLabel } }
              : n
          )
        );
      }
    },
    [setNodes]
  );

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 p-3 flex gap-2 border-b border-gray-700 items-center">
        <button
          onClick={() => addNode("input")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Start Node
        </button>
        <button
          onClick={() => addNode("default")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          + Process Node
        </button>
        <button
          onClick={() => addNode("output")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          + End Node
        </button>
        <div className="ml-auto text-gray-400 text-sm">
          💡 Double-click a node to edit its name
        </div>
      </div>

      {/* Flow Chart Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;
