import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  FluentProvider,
  webLightTheme,
  Card,
  CardHeader,
  Button,
  Input,
  Textarea,
  Field,
  makeStyles,
  tokens,
  Title3,
  Subtitle2,
  Text,
  Tag,
  TagGroup,
  Divider,
  Combobox,
  Option,
  Slider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  Switch
} from "@fluentui/react-components";
import { Delete16Regular, Add16Regular, CalendarClock24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  shell: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    color: tokens.colorBrandForeground1
  },
  grid: {
    display: "grid",
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
  },
  stack: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  collaborators: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  collaboratorBlock: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingHorizontalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2
  },
  collaboratorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  diagramWrap: {
    width: "100%",
    maxWidth: "100%",
    height: "360px",
    position: "relative"
  },
  diagramWrapExpanded: {
    height: "calc(100vh - 40px)",
    minHeight: "95vh"
  },
  diagramCard: {
    position: "relative"
  },
  diagramExpanded: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    maxWidth: "100vw",
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow64,
    overflow: "auto",
    padding: tokens.spacingHorizontalL
  },
  overlayFooter: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
    alignItems: "center"
  },
  wideCard: {
    gridColumn: "span 2",
    minWidth: "640px",
    width: "100%"
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS
  },
  painOverlay: {
    position: "absolute",
    top: "50%",
    right: "30px",
    transform: "translateY(-50%)",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow16,
    padding: tokens.spacingHorizontalM,
    minWidth: "260px",
    maxWidth: "340px",
    maxHeight: "280px",
    overflow: "auto",
    cursor: "grab"
  },
  painOverlayDragging: {
    cursor: "grabbing"
  },
  painOverlayWide: {
    minWidth: "380px",
    maxWidth: "620px"
  }
});

const stringToHslColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 55%)`;
};

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

const truncate = (str, max = 22) => {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
};

const AddableList = ({ label, placeholder, items, onAdd, onRemove }) => {
  const [value, setValue] = useState("");
  const styles = useStyles();

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div className="list">
      <Field label={label} required>
        <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(_, data) => setValue(data.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button appearance="primary" onClick={handleAdd} icon={<Add16Regular />}>
            Add
          </Button>
        </div>
      </Field>
      <div style={{ marginTop: tokens.spacingVerticalS }}>
        {items.length === 0 && <Text className="muted">Nothing added yet.</Text>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalXS }}>
          {items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: tokens.spacingHorizontalXXS,
                padding: "6px 10px",
                borderRadius: "16px",
                background: tokens.colorNeutralBackground3,
                border: `1px solid ${tokens.colorNeutralStroke2}`
              }}
            >
              <Text>{item}</Text>
              <Button
                size="small"
                appearance="subtle"
                icon={<Delete16Regular />}
                aria-label={`Remove ${item}`}
                onClick={() => onRemove(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CollaboratorCard = ({
  collaborator,
  styles,
  onRemove,
  onAddTask,
  onRemoveTask,
  toolsOptions,
  onAddTool,
  onRemoveTool
}) => {
  const [taskValue, setTaskValue] = useState("");
  const [toolValue, setToolValue] = useState("");

  const addTask = () => {
    const trimmed = taskValue.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setTaskValue("");
  };

  const addTool = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddTool(trimmed);
    setToolValue("");
  };

  return (
    <div className={styles.collaboratorBlock}>
      <div className={styles.collaboratorHeader}>
        <Subtitle2>{collaborator.name}</Subtitle2>
        <Button
          appearance="subtle"
          icon={<Delete16Regular />}
          aria-label={`Remove ${collaborator.name}`}
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
      <Field label="Tasks between this role and collaborator">
        <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
          <Input
            value={taskValue}
            placeholder="Add a shared task"
            onChange={(_, data) => setTaskValue(data.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
          />
          <Button icon={<Add16Regular />} appearance="primary" onClick={addTask}>
            Add
          </Button>
        </div>
      </Field>
      <TagGroup aria-label="Tasks" style={{ marginTop: tokens.spacingVerticalXS }}>
        {collaborator.tasks.length === 0 && <Text className={styles.muted}>No tasks yet.</Text>}
        {collaborator.tasks.map((task, idx) => (
          <Tag key={`${task}-${idx}`} dismissible onDismiss={() => onRemoveTask(idx)} shape="rounded">
            {task}
          </Tag>
        ))}
      </TagGroup>

      <Field label="Tools this collaborator uses">
        <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
          <Combobox
            freeform
            placeholder="Select or type a tool"
            value={toolValue}
            onOptionSelect={(_, data) => addTool(data.optionValue || data.value || "")}
            onChange={(_, data) => setToolValue(data.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTool(toolValue);
              }
            }}
            style={{ minWidth: "200px" }}
          >
            {toolsOptions.map((tool) => (
              <Option key={tool} value={tool}>
                {tool}
              </Option>
            ))}
          </Combobox>
          <Button icon={<Add16Regular />} onClick={() => addTool(toolValue)}>
            Add
          </Button>
        </div>
      </Field>
      <TagGroup aria-label="Collaborator tools" style={{ marginTop: tokens.spacingVerticalXS }}>
        {collaborator.tools?.length === 0 && <Text className={styles.muted}>No tools yet.</Text>}
        {(collaborator.tools || []).map((tool, idx) => (
          <Tag key={`${tool}-${idx}`} dismissible onDismiss={() => onRemoveTool(idx)} shape="rounded" appearance="outline">
            {tool}
          </Tag>
        ))}
      </TagGroup>
    </div>
  );
};

const Diagram = React.forwardRef(
  (
    {
      roleName,
      collaborators,
      sharedTasksMap,
      sharedToolsMap,
      painPoints,
      nodePositions,
      setNodePositions,
      expanded
    },
    svgRef
  ) => {
    const width = 900;
    const height = expanded ? 1100 : 360;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = expanded ? 240 : 220;
    const nodeWidth = 240;
    const nodeHeight = 120;
    const roleWidth = 300;
    const roleHeight = 160;
    const roleAvatarR = 24;
    const nodeAvatarR = 24;

    const localSvgRef = useRef(null);
    const mergedRef = (node) => {
      localSvgRef.current = node;
      if (typeof svgRef === "function") svgRef(node);
      else if (svgRef) svgRef.current = node;
    };

    const nodes = useMemo(() => {
      if (!collaborators.length) return [];
      return collaborators.map((collab, idx) => {
        const angle = (2 * Math.PI * idx) / collaborators.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const key = `collab-${collab.name}`;
        const override = nodePositions[key];
        return { ...collab, tools: collab.tools || [], x: override?.x ?? x, y: override?.y ?? y, key };
      });
    }, [collaborators, nodePositions]);

    useEffect(() => {
      const valid = new Set(nodes.map((n) => n.key));
      setNodePositions((prev) => {
        const next = {};
        Object.entries(prev || {}).forEach(([k, v]) => {
          if (valid.has(k)) next[k] = v;
        });
        return next;
      });
    }, [nodes, setNodePositions]);

    const updatePosition = (key, clientX, clientY, offset = { x: 0, y: 0 }) => {
      const rect = (svgRef?.current || localSvgRef.current)?.getBoundingClientRect();
      if (!rect) return;
      const x = clientX - rect.left - offset.x;
      const y = clientY - rect.top - offset.y;
      setNodePositions((prev) => ({ ...(prev || {}), [key]: { x, y } }));
    };

    const [dragging, setDragging] = useState(null);
    const handlePointerDown = (key) => (e) => {
      e.preventDefault();
      const rect = (svgRef?.current || localSvgRef.current)?.getBoundingClientRect();
      if (!rect) return;
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const currentPos = nodePositions[key] || (() => {
        const node = nodes.find((n) => n.key === key);
        if (node) return { x: node.x, y: node.y };
        return { x: currentX, y: currentY };
      })();
      const offset = { x: currentX - currentPos.x, y: currentY - currentPos.y };
      setDragging({ key, offset });
      e.target.setPointerCapture?.(e.pointerId);
    };
    const handlePointerMove = (e) => {
      if (!dragging) return;
      updatePosition(dragging.key, e.clientX, e.clientY, dragging.offset);
    };
    const handlePointerUp = (e) => {
      setDragging(null);
      e.target.releasePointerCapture?.(e.pointerId);
    };

    return (
      <svg
        ref={mergedRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Role to collaborator tasks"
        style={{ width: "100%", height: "100%" }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
      <defs>
        <linearGradient id="roleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={tokens.colorBrandBackground} stopOpacity="0.9" />
          <stop offset="100%" stopColor={tokens.colorBrandBackground2} stopOpacity="0.9" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.18)" />
        </filter>
      </defs>

        <g>
      {nodes.map((node, idx) => {
        const midX = (centerX + node.x) / 2;
        const midY = (centerY + node.y) / 2;
          const angle = Math.atan2(node.y - centerY, node.x - centerX);
          const curveOffset = 30;
          const ctrlX = midX + curveOffset * Math.cos(angle + Math.PI / 2);
          const ctrlY = midY + curveOffset * Math.sin(angle + Math.PI / 2);
          const sharedLabel = (node.tasks.filter((t) => (sharedTasksMap[t]?.length || 0) > 1).join(" • ")) || "";
          const sharedTools = (node.tools || []).filter((t) => (sharedToolsMap?.[t]?.length || 0) > 1);
        return (
          <g key={`conn-${node.name}-${idx}`}>
            <path
              d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${node.x} ${node.y}`}
              fill="none"
              stroke={tokens.colorNeutralStroke2}
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.35"
            />
            {sharedLabel ? (
              <text x={midX} y={midY - 8} textAnchor="middle" fontSize="10" fill={tokens.colorNeutralForeground2}>
                {truncate(sharedLabel, 22)}
              </text>
            ) : null}
            {sharedTools.length ? (
              <text x={midX} y={midY + 10} textAnchor="middle" fontSize="10" fill={tokens.colorNeutralForeground2}>
                {truncate(`Tools: ${sharedTools.join(", ")}`, 22)}
              </text>
            ) : null}
          </g>
        );
      })}
        </g>

        <g
          transform={`translate(${centerX - roleWidth / 2}, ${centerY - roleHeight / 2})`}
          filter="url(#shadow)"
        >
          <rect
            width={roleWidth}
            height={roleHeight}
            rx="16"
            fill={tokens.colorNeutralBackground1}
            stroke={tokens.colorNeutralStroke2}
          />
        <circle
          cx={38}
          cy={roleHeight / 2}
          r={roleAvatarR}
          fill={tokens.colorBrandBackground}
          stroke={tokens.colorNeutralBackground1}
          strokeWidth="2"
        />
        <text x={38} y={roleHeight / 2 + 6} textAnchor="middle" fontSize="14" fill="white" fontWeight="700">
          {initials(roleName || "Role")}
        </text>
        <text
          x={80}
          y={roleHeight / 2}
          fontSize="16"
          fill={tokens.colorNeutralForeground1}
          fontWeight="700"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {truncate(roleName || "Role", 24)}
        </text>
        </g>

        {nodes.map((node) => (
          <g key={node.key}>
            <g
              transform={`translate(${node.x - nodeWidth / 2}, ${node.y - nodeHeight / 2})`}
              filter="url(#shadow)"
              onPointerDown={handlePointerDown(node.key)}
              style={{ cursor: "grab" }}
            >
              <rect
              width={nodeWidth}
              height={nodeHeight}
              rx="14"
              fill={tokens.colorNeutralBackground1}
              stroke={tokens.colorNeutralStroke2}
            />
            <circle
              cx={28}
              cy={nodeHeight / 2}
              r={nodeAvatarR}
              fill={tokens.colorPaletteBlueBorderActive}
              stroke={tokens.colorNeutralBackground1}
              strokeWidth="2"
            />
            <text x={28} y={nodeHeight / 2 + 4} textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
              {initials(node.name)}
            </text>
            <text
              x={60}
              y={nodeHeight / 2 + 3}
              fontSize="15"
              fill={tokens.colorNeutralForeground1}
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
            >
              {truncate(node.name, 20)}
            </text>
            </g>
          </g>
        ))}
      </svg>
    );
  }
);

const App = () => {
  const styles = useStyles();
  const [roleName, setRoleName] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState([]);
  const [tools, setTools] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collabName, setCollabName] = useState("");
  const [painPoints, setPainPoints] = useState([]);
  const [painForm, setPainForm] = useState({
    severity: 5,
    delay: "",
    cost: "",
    task: "",
    description: ""
  });
  const [diagramExpanded, setDiagramExpanded] = useState(false);
  const [painSort, setPainSort] = useState({ column: "severity", direction: "desc" });
  const [nodePositions, setNodePositions] = useState({});
  const [painOverlayPos, setPainOverlayPos] = useState({ x: null, y: null });
  const [painOverlayDragging, setPainOverlayDragging] = useState(false);
  const [painOverlayWide, setPainOverlayWide] = useState(false);
  const diagramRef = useRef(null);

  const summary = useMemo(() => ({
    role: roleName || "Not set",
    headcount: headcount || "Not set",
    description: description || "No description yet.",
    goals,
    tools,
    collaborators: collaborators.map((c) => c.name),
    painPoints
  }), [roleName, headcount, description, goals, tools, collaborators, painPoints]);

  const addCollaborator = () => {
    const trimmed = collabName.trim();
    if (!trimmed) return;
    setCollaborators([...collaborators, { name: trimmed, tasks: [], tools: [] }]);
    setCollabName("");
  };

  const removeCollaborator = (idx) => {
    setCollaborators(collaborators.filter((_, i) => i !== idx));
  };

  const addTaskToCollaborator = (idx, task) => {
    setCollaborators(collaborators.map((c, i) => (i === idx ? { ...c, tasks: [...c.tasks, task] } : c)));
  };

  const addToolToCollaborator = (idx, tool) => {
    setCollaborators(collaborators.map((c, i) => {
      if (i !== idx) return c;
      if (c.tools?.includes(tool)) return c;
      return { ...c, tools: [...(c.tools || []), tool] };
    }));
    if (!tools.includes(tool)) setTools([...tools, tool]);
  };

  const removeTaskFromCollaborator = (collabIdx, taskIdx) => {
    setCollaborators(collaborators.map((c, i) => {
      if (i !== collabIdx) return c;
      return { ...c, tasks: c.tasks.filter((_, tIdx) => tIdx !== taskIdx) };
    }));
  };

  const removeToolFromCollaborator = (collabIdx, toolIdx) => {
    setCollaborators(collaborators.map((c, i) => {
      if (i !== collabIdx) return c;
      return { ...c, tools: (c.tools || []).filter((_, tIdx) => tIdx !== toolIdx) };
    }));
  };

  const sharedTasksMap = useMemo(() => {
    const map = {};
    collaborators.forEach((c) => {
      c.tasks.forEach((task) => {
        map[task] = map[task] || [];
        map[task].push(c.name);
      });
    });
    return map;
  }, [collaborators]);

  const sharedToolsMap = useMemo(() => {
    const map = {};
    tools.forEach((tool) => {
      map[tool] = map[tool] || [];
      map[tool].push("Role");
    });
    collaborators.forEach((c) => {
      c.tools.forEach((tool) => {
        map[tool] = map[tool] || [];
        map[tool].push(c.name);
      });
    });
    return map;
  }, [tools, collaborators]);

  const sharedToolsList = Object.entries(sharedToolsMap).filter(([, list]) => list.length > 1);
  const sharedTasksList = Object.entries(sharedTasksMap).filter(([, list]) => list.length > 1);

  const taskOptions = useMemo(() => {
    const set = new Set();
    collaborators.forEach((c) => c.tasks.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [collaborators]);

  const sortedPainPoints = useMemo(() => {
    const sorted = [...painPoints];
    sorted.sort((a, b) => {
      const dir = painSort.direction === "asc" ? 1 : -1;
      if (painSort.column === "severity") return dir * (a.severity - b.severity);
      if (painSort.column === "delay") return dir * (a.delay || "").localeCompare(b.delay || "");
      if (painSort.column === "cost") return dir * (a.cost || "").localeCompare(b.cost || "");
      return dir * a.title.localeCompare(b.title);
    });
    return sorted;
  }, [painPoints, painSort]);

  const addPainPoint = () => {
    const task = painForm.task.trim();
    if (!task) return;
    const severity = Number(painForm.severity) || 0;
    setPainPoints([
      ...painPoints,
      {
        title: task,
        severity,
        delay: painForm.delay.trim(),
        cost: painForm.cost.trim(),
        task,
        description: painForm.description.trim()
      }
    ]);
    setPainForm({ severity: 5, delay: "", cost: "", task: "", description: "" });
  };

  const removePainPoint = (idx) => {
    setPainPoints(painPoints.filter((_, i) => i !== idx));
  };

  const handlePainOverlayPointerDown = (e) => {
    if (!diagramExpanded) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = { x: startX - rect.left, y: startY - rect.top };
    setPainOverlayDragging(true);
    const move = (ev) => {
      setPainOverlayPos({ x: ev.clientX - offset.x, y: ev.clientY - offset.y });
    };
    const up = () => {
      setPainOverlayDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.shell}>
        <div className={styles.grid}>
          <Card>
            <CardHeader
              header={<Subtitle2>Role Overview</Subtitle2>}
              description={<Text className={styles.muted}>Role basics that inform everything else.</Text>}
            />
            <div className={styles.stack}>
              <Field label="Role" required>
                <Input placeholder="e.g., Customer Support Specialist" value={roleName} onChange={(_, d) => setRoleName(d.value)} />
              </Field>
              <Field label="Number of employees">
                <Input type="number" min={0} placeholder="e.g., 15" value={headcount} onChange={(_, d) => setHeadcount(d.value)} />
              </Field>
              <Field label="Description">
                <Textarea placeholder="What does a typical day look like?" value={description} onChange={(_, d) => setDescription(d.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader header={<Subtitle2>Goals</Subtitle2>} description={<Text className={styles.muted}>Desired outcomes.</Text>} />
            <AddableList
              label="Goal"
              placeholder="Add a goal"
              items={goals}
              onAdd={(v) => setGoals([...goals, v])}
              onRemove={(idx) => setGoals(goals.filter((_, i) => i !== idx))}
            />
          </Card>

          <Card>
            <CardHeader header={<Subtitle2>Tools</Subtitle2>} description={<Text className={styles.muted}>Systems and instruments.</Text>} />
            <AddableList
              label="Tool"
              placeholder="Add a tool"
              items={tools}
              onAdd={(v) => setTools([...tools, v])}
              onRemove={(idx) => setTools(tools.filter((_, i) => i !== idx))}
            />
          </Card>

          <Card>
            <CardHeader header={<Subtitle2>Collaborators & Tasks</Subtitle2>} description={<Text className={styles.muted}>Link collaborators to this role and map shared tasks.</Text>} />
            <div className={styles.stack}>
              <Field label="Collaborator">
                <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
                  <Input
                    placeholder="e.g., Product Manager"
                    value={collabName}
                    onChange={(_, d) => setCollabName(d.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCollaborator();
                      }
                    }}
                  />
                  <Button appearance="primary" icon={<Add16Regular />} onClick={addCollaborator}>
                    Add
                  </Button>
                </div>
              </Field>
              <div className={styles.collaborators}>
                {collaborators.length === 0 && <Text className={styles.muted}>No collaborators yet. Add one to define shared tasks.</Text>}
                {collaborators.map((collab, idx) => (
                  <CollaboratorCard
                    key={collab.name + idx}
                    collaborator={collab}
                    styles={styles}
                    toolsOptions={tools}
                    onRemove={() => removeCollaborator(idx)}
                    onAddTask={(task) => addTaskToCollaborator(idx, task)}
                    onRemoveTask={(taskIdx) => removeTaskFromCollaborator(idx, taskIdx)}
                    onAddTool={(tool) => addToolToCollaborator(idx, tool)}
                    onRemoveTool={(toolIdx) => removeToolFromCollaborator(idx, toolIdx)}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className={styles.wideCard}>
            <CardHeader
              header={<Subtitle2>Collaboration Map</Subtitle2>}
              description={<Text className={styles.muted}>Visio-style visualization of the role and collaborator links with shared tasks.</Text>}
            />
            <div className={`${styles.diagramWrap} ${diagramExpanded ? `${styles.diagramExpanded} ${styles.diagramWrapExpanded}` : ""}`}>
              <div className={styles.overlayFooter}>
                <Switch checked={diagramExpanded} onChange={(_, data) => setDiagramExpanded(data.checked)} label="Expand to full screen" />
                {diagramExpanded && (
                  <>
                <Field label="Task (shared or not)" style={{ minWidth: "220px" }}>
                  <Combobox
                    placeholder="Select or type a task"
                    freeform
                    value={painForm.task}
                    onOptionSelect={(_, data) =>
                      setPainForm({
                        ...painForm,
                        task: data.optionValue || data.value || "",
                        shared: false
                      })
                    }
                    onChange={(_, data) => setPainForm({ ...painForm, task: data.value })}
                  >
                    {taskOptions.map((t) => (
                      <Option key={t} value={t}>
                        {t} {sharedTasksMap[t]?.length > 1 ? "(shared)" : ""}
                      </Option>
                    ))}
                  </Combobox>
                </Field>
                <Field label={`Severity (${painForm.severity}/10)`} style={{ width: "200px" }}>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={painForm.severity}
                    onChange={(_, data) => setPainForm({ ...painForm, severity: data.value })}
                  />
                </Field>
                <Field label="Delay / time" style={{ minWidth: "140px" }}>
                  <Input
                    placeholder="+2 hrs"
                    value={painForm.delay}
                    onChange={(_, d) => setPainForm({ ...painForm, delay: d.value })}
                  />
                </Field>
                <Field label="Cost / risk" style={{ minWidth: "140px" }}>
                  <Input
                    placeholder="$500/week"
                    value={painForm.cost}
                    onChange={(_, d) => setPainForm({ ...painForm, cost: d.value })}
                  />
                </Field>
                <Field label="Why is it painful?" style={{ minWidth: "220px" }}>
                  <Input
                    placeholder="Describe the impact"
                    value={painForm.description}
                    onChange={(_, d) => setPainForm({ ...painForm, description: d.value })}
                  />
                </Field>
                <Button appearance="primary" icon={<Add16Regular />} onClick={addPainPoint}>
                  Add pain point
                </Button>
                  </>
                )}
              </div>
              <Diagram
                roleName={roleName || "Role"}
                collaborators={collaborators}
                sharedTasksMap={sharedTasksMap}
                sharedToolsMap={sharedToolsMap}
                painPoints={painPoints}
                expanded={diagramExpanded}
                nodePositions={nodePositions}
                setNodePositions={setNodePositions}
                ref={diagramRef}
              />
              {diagramExpanded && (
                <div
                  className={`${styles.painOverlay} ${painOverlayDragging ? styles.painOverlayDragging : ""} ${painOverlayWide ? styles.painOverlayWide : ""}`}
                  style={{
                    left: painOverlayPos.x ?? "auto",
                    top: painOverlayPos.y ?? "50%"
                  }}
                  onPointerDown={handlePainOverlayPointerDown}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.spacingHorizontalS }}>
                    <Subtitle2>Pain points</Subtitle2>
                    <Button size="small" appearance="subtle" onClick={() => setPainOverlayWide(!painOverlayWide)}>
                      {painOverlayWide ? "Collapse" : "Expand"}
                    </Button>
                  </div>
                  <div style={{ marginTop: tokens.spacingVerticalXS }}>
                    <Table size="small">
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell
                            onClick={() =>
                              setPainSort({
                                column: "title",
                                direction: painSort.column === "title" && painSort.direction === "asc" ? "desc" : "asc"
                              })
                            }
                          >
                            Title {painSort.column === "title" ? (painSort.direction === "asc" ? "▲" : "▼") : ""}
                          </TableHeaderCell>
                          <TableHeaderCell
                            onClick={() =>
                              setPainSort({
                                column: "severity",
                                direction: painSort.column === "severity" && painSort.direction === "asc" ? "desc" : "asc"
                              })
                            }
                          >
                            Sev {painSort.column === "severity" ? (painSort.direction === "asc" ? "▲" : "▼") : ""}
                          </TableHeaderCell>
                          {painOverlayWide && (
                            <>
                              <TableHeaderCell
                                onClick={() =>
                                  setPainSort({
                                    column: "delay",
                                    direction: painSort.column === "delay" && painSort.direction === "asc" ? "desc" : "asc"
                                  })
                                }
                              >
                                Delay {painSort.column === "delay" ? (painSort.direction === "asc" ? "▲" : "▼") : ""}
                              </TableHeaderCell>
                              <TableHeaderCell
                                onClick={() =>
                                  setPainSort({
                                    column: "cost",
                                    direction: painSort.column === "cost" && painSort.direction === "asc" ? "desc" : "asc"
                                  })
                                }
                              >
                                Cost {painSort.column === "cost" ? (painSort.direction === "asc" ? "▲" : "▼") : ""}
                              </TableHeaderCell>
                              <TableHeaderCell>Task</TableHeaderCell>
                            </>
                          )}
                          <TableHeaderCell>Why painful</TableHeaderCell>
                          <TableHeaderCell></TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedPainPoints.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Text className={styles.muted}>No pain points yet.</Text>
                            </TableCell>
                          </TableRow>
                          ) : (
                            sortedPainPoints.map((p, idx) => (
                              <TableRow key={`${p.title}-${idx}`}>
                                <TableCell>{truncate(p.title, 24)}</TableCell>
                                <TableCell>{p.severity}</TableCell>
                                {painOverlayWide && (
                                  <>
                                    <TableCell>{truncate(p.delay || "—", 16)}</TableCell>
                                    <TableCell>{truncate(p.cost || "—", 16)}</TableCell>
                                    <TableCell>{truncate(p.task || "—", 18)}</TableCell>
                                  </>
                                )}
                                <TableCell>{truncate(p.description || "—", 22)}</TableCell>
                                <TableCell>
                                  <Button
                                    appearance="subtle"
                                    icon={<Delete16Regular />}
                                  aria-label="Remove pain point"
                                  onClick={() => removePainPoint(idx)}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              <div className={styles.stack} style={{ marginTop: tokens.spacingVerticalM }}>
                <Divider />
                <div style={{ display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <div>
                    <Subtitle2>Shared Tools</Subtitle2>
                    {sharedToolsList.length === 0 && <Text className={styles.muted}>No overlaps yet.</Text>}
                    {sharedToolsList.map(([tool, list]) => (
                      <Text key={tool}>• {tool}: {list.join(", ")}</Text>
                    ))}
                  </div>
                  <div>
                    <Subtitle2>Shared Tasks</Subtitle2>
                    {sharedTasksList.length === 0 && <Text className={styles.muted}>No overlaps yet.</Text>}
                    {sharedTasksList.map(([task, list]) => (
                      <Text key={task}>• {task}: {list.join(", ")}</Text>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </FluentProvider>
  );
};

export default App;
