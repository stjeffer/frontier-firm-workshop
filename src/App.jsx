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
  Switch,
  MenuList,
  MenuItem,
  MenuDivider,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Badge,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@fluentui/react-components";
import {
  Delete16Regular,
  Add16Regular,
  CalendarClock24Regular,
  PeopleCommunity16Regular,
  Toolbox16Regular,
  Target16Regular
} from "@fluentui/react-icons";

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
  rowFull: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: tokens.spacingHorizontalM
  },
  rowTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: tokens.spacingHorizontalM
  },
  rowThree: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: tokens.spacingHorizontalM
  },
  roleOverviewGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) 2fr",
    gap: tokens.spacingHorizontalM,
    alignItems: "end"
  },
  roleOverviewLeft: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: tokens.spacingVerticalS
  },
  toolbar: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    marginBottom: tokens.spacingVerticalS
  },
  stack: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  collaborators: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  collaboratorBlock: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingHorizontalL,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16
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
    alignItems: "center",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
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
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    justifyContent: "space-between"
  },
  topNavLeft: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM
  },
  pillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    padding: "6px 10px",
    borderRadius: "6px",
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`
  },
  visualSplit: {
    display: "flex",
    gap: tokens.spacingHorizontalL,
    alignItems: "stretch",
    height: "100%"
  },
  visualPane: {
    flex: 2,
    minWidth: 0
  },
  painPane: {
    flex: 1,
    minWidth: "700px",
    maxWidth: "750px",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: tokens.spacingHorizontalL,
    alignItems: "flex-start"
  },
  navRail: {
    position: "sticky",
    top: tokens.spacingVerticalL,
    height: "100vh",
    padding: tokens.spacingHorizontalM,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM
  },
  navGroup: {
    display: "grid",
    gap: tokens.spacingVerticalXS
  },
  navLabel: {
    margin: `${tokens.spacingVerticalXS} 0`,
    color: tokens.colorNeutralForeground2
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

const nameTone = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return {
    primary: `hsl(${h}, 70%, 50%)`,
    soft: `hsl(${h}, 70%, 90%)`
  };
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

const severityLabel = {
  1: "Mild inconvenience",
  2: "Noticeable friction",
  3: "Material delay or cost",
  4: "High business impact",
  5: "Critical issue / repeated failure"
};

  const occurrencesByFrequency = {
    daily: { weekly: 5, monthly: 22 },
    weekly: { weekly: 1, monthly: 4.35 },
    monthly: { weekly: 0.25, monthly: 1 },
    adhoc: { weekly: 0, monthly: 0 }
  };

  const formatMinutes = (minutes) => {
    if (!minutes || Number.isNaN(minutes)) return "—";
    if (minutes < 60) return `${Math.round(minutes)} mins`;
    const hours = minutes / 60;
    return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
  };

const painPalette = [
  { threshold: 1, color: "#107c10", stroke: "#0b6a0b" },
  { threshold: 2, color: "#c19c00", stroke: "#8b6f00" },
  { threshold: 3, color: "#f7630c", stroke: "#c3540a" },
  { threshold: 4, color: "#d13438", stroke: "#b02024" },
  { threshold: 5, color: "#a4262c", stroke: "#8c1f24" }
];

const getPainVisual = (painPoints, task) => {
  const hit = painPoints.find((p) => (p.task || p.title) === task);
  if (!hit) return { color: tokens.colorNeutralBackground1, stroke: tokens.colorNeutralStroke2, weekly: 0 };
  const perOccMinutes = (Number(hit.durationValue) || 0) * (hit.durationUnit === "hours" ? 60 : 1);
  const occ = occurrencesByFrequency[hit.frequency || "weekly"] || occurrencesByFrequency.weekly;
  const weeklyMinutes = perOccMinutes * (occ.weekly ?? 0);
  const palette = painPalette[Math.min(Math.max(hit.severity, 1), 5) - 1];
  return { color: palette.color, stroke: palette.stroke, weekly: weeklyMinutes };
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
        <div className={styles.pillWrap}>
          {items.map((item, idx) => (
            <span key={`${item}-${idx}`} className={styles.pill}>
              <Text weight="semibold" style={{ color: tokens.colorNeutralForeground1 }}>
                {item}
              </Text>
              <Button
                appearance="subtle"
                size="small"
                icon={<Delete16Regular />}
                aria-label={`Remove ${item}`}
                onClick={() => onRemove(idx)}
                style={{ color: tokens.colorNeutralForeground2, minWidth: "auto" }}
              />
            </span>
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
      soloTasks,
      onTaskSelect,
      nodePositions,
      setNodePositions,
      expanded
    },
    svgRef
  ) => {
    const width = 900;
    const height = 720; // keep scale consistent between compact and full screen
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = expanded ? 150 : 150;
    const nodeWidth = expanded ? 170 : 150;
    const nodeHeight = nodeWidth;
    const roleWidth = expanded ? 200 : 150;
    const roleHeight = roleWidth;
    const roleAvatarR = 32;
    const nodeAvatarR = 26;

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
      // avoid state update if nothing changed
      const prevKeys = Object.keys(prev || {});
      const nextKeys = Object.keys(next);
      if (prevKeys.length === nextKeys.length && prevKeys.every((k) => next[k] === prev[k])) {
        return prev;
      }
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
        <mask id="roleMask">
          <rect x="0" y="0" width={width} height={height} fill="white" />
          <rect
            x={centerX - roleWidth / 2}
            y={centerY - roleHeight / 2}
            width={roleWidth}
            height={roleHeight}
            fill="black"
          />
        </mask>
        <mask id="soloMask">
          <rect x="0" y="0" width={width} height={height} fill="white" />
          <rect
            x={centerX - roleWidth / 2}
            y={centerY - roleHeight / 2}
            width={roleWidth}
            height={roleHeight}
            fill="black"
          />
        </mask>
      </defs>

        <g mask="url(#roleMask)">
      {nodes.map((node, idx) => {
        const midX = (centerX + node.x) / 2;
        const midY = (centerY + node.y) / 2;
        const angle = Math.atan2(node.y - centerY, node.x - centerX);
        const curveOffset = 30;
        const ctrlX = midX + curveOffset * Math.cos(angle + Math.PI / 2);
        const ctrlY = midY + curveOffset * Math.sin(angle + Math.PI / 2);
        const tasksList = node.tasks || [];
        return (
            <g key={`conn-${node.name}-${idx}`}>
              <path
                d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${node.x} ${node.y}`}
                fill="none"
                stroke={tokens.colorNeutralStroke2}
                strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.35"
              style={{ pointerEvents: "none" }}
            />
            {tasksList.length > 0 && (() => {
              const pillHeight = 24;
              const gapY = 10;
              const totalHeight = tasksList.length * pillHeight + (tasksList.length - 1) * gapY;
              let startY = midY - totalHeight / 2;
              return (
                <g>
                  {tasksList.map((task, i) => {
                    const visual = getPainVisual(painPoints, task);
                    const text = task; // no truncation
                    const width = Math.max(60, text.length * 7 + 28);
                    const x = midX - width / 2;
                    const y = startY + i * (pillHeight + gapY);
                    return (
                      <g
                        key={`${node.name}-pill-${i}`}
                        onClick={() => onTaskSelect?.(task)}
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      >
                        <rect
                          x={x}
                          y={y - pillHeight / 2}
                          width={width}
                          height={pillHeight}
                          rx={12}
                          fill={tokens.colorNeutralBackground1}
                          stroke={visual.stroke}
                          strokeWidth="2"
                          pointerEvents="all"
                        />
                        <rect
                          x={x + 2}
                          y={y - pillHeight / 2 + 2}
                          width={width - 4}
                          height={pillHeight - 4}
                          rx={10}
                          fill={visual.color}
                          opacity="0.08"
                          stroke="none"
                          pointerEvents="none"
                        />
                        <text
                          x={midX}
                          y={y + 4}
                          textAnchor="middle"
                          fontSize="12"
                          fill={tokens.colorNeutralForeground1}
                          fontWeight="600"
                          pointerEvents="none"
                        >
                          {text}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </g>
        );
      })}
        </g>

        {soloTasks?.length ? (() => {
          const badgeHeight = 24;
          const gap = 12;
          const offsetX = roleWidth / 2 + 80;
          const totalHeight = soloTasks.length * badgeHeight + (soloTasks.length - 1) * gap;
          const startY = centerY - totalHeight / 2;
          const side = 1;
          return (
            <g style={{ pointerEvents: "all" }}>
              <text
                x={centerX + side * (offsetX + 30)}
                y={startY - 18}
                textAnchor={side === 1 ? "start" : "end"}
                fontSize="12"
                fill={tokens.colorNeutralForeground2}
              >
                Individual tasks
              </text>
              {soloTasks.map((task, idx) => {
                const y = startY + idx * (badgeHeight + gap);
                const label = task.title;
                const width = Math.max(110, label.length * 7 + 36);
                const xCenter = centerX + side * offsetX;
                const x = xCenter - (side === 1 ? 0 : width);
                const textAnchor = side === 1 ? "start" : "end";
                const visual = getPainVisual(painPoints, task.title);
                return (
                  <g
                    key={`solo-${idx}`}
                    onClick={() => onTaskSelect?.(task.title)}
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                  >
                    <rect
                      x={x}
                      y={y - badgeHeight / 2}
                      width={width}
                      height={badgeHeight}
                      rx={badgeHeight / 2}
                      fill="transparent"
                      pointerEvents="all"
                      onClick={() => onTaskSelect?.(task.title)}
                    />
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={xCenter}
                      y2={y}
                      stroke={tokens.colorNeutralStroke2}
                      strokeWidth="3"
                      strokeDasharray="4 3"
                      opacity="0.35"
                      style={{ pointerEvents: "none" }}
                    />
                    <rect
                      x={x}
                      y={y - badgeHeight / 2}
                      width={width}
                      height={badgeHeight}
                      rx={badgeHeight / 2}
                      fill={tokens.colorNeutralBackground1}
                      stroke={visual.stroke}
                      strokeWidth="2"
                      pointerEvents="none"
                    />
                    <rect
                      x={x + 2}
                      y={y - badgeHeight / 2 + 2}
                      width={width - 4}
                      height={badgeHeight - 4}
                      rx={10}
                      fill={visual.color}
                      opacity="0.08"
                      stroke="none"
                      pointerEvents="none"
                    />
                    <text
                      x={x + (side === 1 ? 12 : width - 12)}
                      y={y + 4}
                      textAnchor={textAnchor}
                      fontSize="12"
                      fill={tokens.colorNeutralForeground1}
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })() : null}

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
          {(() => {
            const { primary, soft } = nameTone(roleName || "Role");
            const inset = 14;
            const tile = roleWidth - inset * 2;
            const avatarR = roleAvatarR;
            return (
              <>
                <rect x={inset} y={inset} width={tile} height={tile} rx="12" fill={tokens.colorNeutralBackground2} />
                <rect
                  x={roleWidth / 2 - 46}
                  y={inset + 10}
                  width={92}
                  height={92}
                  rx="10"
                  fill={soft}
                  stroke={tokens.colorNeutralStroke2}
                />
                <circle
                  cx={roleWidth / 2}
                  cy={inset + 56}
                  r={avatarR}
                  fill={primary}
                  stroke={tokens.colorNeutralBackground1}
                  strokeWidth="2"
                />
                <text x={roleWidth / 2} y={inset + 60} textAnchor="middle" fontSize="16" fill="white" fontWeight="700">
                  {initials(roleName || "Role")}
                </text>
              </>
            );
          })()}
          <text
            x={roleWidth / 2}
            y={roleHeight - 26}
            fontSize="18"
            fill={tokens.colorNeutralForeground1}
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {truncate(roleName || "Role", 28)}
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
            {(() => {
              const { primary, soft } = nameTone(node.name);
              const inset = 12;
              const tile = nodeWidth - inset * 2;
              return (
                <>
                  <rect x={inset} y={inset} width={tile} height={tile} rx="10" fill={tokens.colorNeutralBackground2} />
                  <rect
                    x={nodeWidth / 2 - 40}
                    y={inset + 10}
                    width={80}
                    height={80}
                    rx="9"
                    fill={soft}
                    stroke={tokens.colorNeutralStroke2}
                  />
                  <circle
                    cx={nodeWidth / 2}
                    cy={inset + 50}
                    r={nodeAvatarR}
                    fill={primary}
                    stroke={tokens.colorNeutralBackground1}
                    strokeWidth="2"
                  />
                  <text x={nodeWidth / 2} y={inset + 54} textAnchor="middle" fontSize="13" fill="white" fontWeight="700">
                    {initials(node.name)}
                  </text>
                </>
              );
            })()}
            <text
              x={nodeWidth / 2}
              y={nodeHeight - 18}
              fontSize={expanded ? "16" : "15"}
              fill={tokens.colorNeutralForeground1}
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {truncate(node.name, expanded ? 18 : 16)}
            </text>
            </g>
          </g>
        ))}

        {soloTasks?.length ? (() => {
          const badgeHeight = 24;
          const gap = 12;
          const offsetX = roleWidth / 2 + 80;
          const totalHeight = soloTasks.length * badgeHeight + (soloTasks.length - 1) * gap;
          const startY = centerY - totalHeight / 2;
          const side = 1; // to the right; flip to -1 for left
          return (
            <g mask="url(#roleMask)" style={{ pointerEvents: "all" }}>
              <text
                x={centerX + side * (offsetX + 30)}
                y={startY - 18}
                textAnchor={side === 1 ? "start" : "end"}
                fontSize="12"
                fill={tokens.colorNeutralForeground2}
              >
                Individual tasks
              </text>
              {soloTasks.map((task, idx) => {
                const y = startY + idx * (badgeHeight + gap);
                const label = task.title;
                const width = Math.max(110, label.length * 7 + 36);
                const xCenter = centerX + side * offsetX;
                const x = xCenter - (side === 1 ? 0 : width);
                const textAnchor = side === 1 ? "start" : "end";
                const visual = getPainVisual(painPoints, task.title);
                return (
                  <g
                    key={`solo-${idx}`}
                    onClick={() => onTaskSelect?.(task.title)}
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                  >
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={xCenter}
                      y2={y}
                      stroke={tokens.colorNeutralStroke2}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.6"
                      style={{ pointerEvents: "none" }}
                    />
                    <rect
                      x={x}
                      y={y - badgeHeight / 2}
                      width={width}
                      height={badgeHeight}
                      rx={badgeHeight / 2}
                      fill={tokens.colorNeutralBackground1}
                      stroke={visual.stroke}
                      strokeWidth="2"
                      pointerEvents="all"
                    />
                    <rect
                      x={x + 2}
                      y={y - badgeHeight / 2 + 2}
                      width={width - 4}
                      height={badgeHeight - 4}
                      rx={10}
                      fill={visual.color}
                      opacity="0.08"
                      stroke="none"
                      pointerEvents="none"
                    />
                    <text
                      x={x + (side === 1 ? 12 : width - 12)}
                      y={y + 4}
                      textAnchor={textAnchor}
                      fontSize="12"
                      fill={tokens.colorNeutralForeground1}
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })() : null}
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
  const [soloTaskInput, setSoloTaskInput] = useState({ title: "", frequency: "weekly" });
  const [soloTasks, setSoloTasks] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collabName, setCollabName] = useState("");
  const [painPoints, setPainPoints] = useState([]);
  const [painForm, setPainForm] = useState({
    severity: 3,
    delay: "",
    cost: "",
    task: "",
    description: "",
    frequency: "weekly",
    durationValue: "",
    durationUnit: "minutes",
    frictionTypes: []
  });
  const [diagramExpanded, setDiagramExpanded] = useState(false);
  const [nodePositions, setNodePositions] = useState({});
  const [painOverlayPos, setPainOverlayPos] = useState({ x: null, y: null });
  const [painOverlayDragging, setPainOverlayDragging] = useState(false);
  const [painOverlayWide, setPainOverlayWide] = useState(false);
  const [painMenuOpen, setPainMenuOpen] = useState(false);
  const [openForm, setOpenForm] = useState(null);
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [savedRoles, setSavedRoles] = useState([]);
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

  const addSoloTask = () => {
    const title = soloTaskInput.title.trim();
    if (!title) return;
    setSoloTasks([...soloTasks, { title, frequency: soloTaskInput.frequency || "weekly" }]);
    setSoloTaskInput({ title: "", frequency: soloTaskInput.frequency || "weekly" });
  };

  const removeSoloTask = (idx) => {
    setSoloTasks(soloTasks.filter((_, i) => i !== idx));
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
    soloTasks.forEach((t) => set.add(t.title));
    return Array.from(set);
  }, [collaborators, soloTasks]);

  const removePainPoint = (idx) => {
    setPainPoints(painPoints.filter((_, i) => i !== idx));
  };

  const addPainPoint = () => {
    const task = painForm.task.trim();
    if (!task) return;
    const severity = Number(painForm.severity) || 0;
    const frictionTypes = Array.isArray(painForm.frictionTypes) ? painForm.frictionTypes.slice(0, 2) : [];
    setPainPoints([
      ...painPoints,
      {
        title: task,
        severity,
        delay: painForm.delay.trim(),
        cost: painForm.cost.trim(),
        task,
        description: painForm.description.trim(),
        frequency: painForm.frequency,
        durationValue: painForm.durationValue,
        durationUnit: painForm.durationUnit,
        frictionTypes
      }
    ]);
    setPainForm({
      severity: 3,
      delay: "",
      cost: "",
      task: "",
      description: "",
      frequency: "weekly",
      durationValue: "",
      durationUnit: "minutes",
      frictionTypes: []
    });
  };
  const openPainForTask = (taskTitle) => {
    const title = taskTitle || "";
    const existing = painPoints.find((p) => (p.task || p.title) === title);
    if (existing) {
      setPainForm({
        severity: existing.severity ?? 3,
        delay: existing.delay || "",
        cost: existing.cost || "",
        task: existing.task || existing.title || title,
        description: existing.description || "",
        frequency: existing.frequency || "weekly",
        durationValue: existing.durationValue || "",
        durationUnit: existing.durationUnit || "minutes",
        frictionTypes: existing.frictionTypes || []
      });
    } else {
      setPainForm((prev) => ({ ...prev, task: title }));
    }
    setPainMenuOpen(true);
    setDiagramExpanded(true);
  };

  const resetRole = () => {
    setRoleName("");
    setHeadcount("");
    setDescription("");
    setGoals([]);
    setTools([]);
    setSoloTasks([]);
    setCollaborators([]);
    setPainPoints([]);
    setNodePositions({});
  };

  const saveRoleSnapshot = () => {
    const id = `${Date.now()}`;
    const name = roleName || "Untitled role";
    const snapshot = {
      id,
      name,
      roleName,
      headcount,
      description,
      goals,
      tools,
      soloTasks,
      collaborators,
      painPoints,
      nodePositions
    };
    setSavedRoles((prev) => [...prev, snapshot]);
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

  const collaborativePainPoints = useMemo(
    () => painPoints.filter((p) => (sharedTasksMap[p.task || p.title] || []).length > 0),
    [painPoints, sharedTasksMap]
  );
  const isolatedPainPoints = useMemo(
    () => painPoints.filter((p) => (sharedTasksMap[p.task || p.title] || []).length === 0),
    [painPoints, sharedTasksMap]
  );

  const calcPainLoss = (p) => {
    const perOcc = (Number(p.durationValue) || 0) * (p.durationUnit === "hours" ? 60 : 1);
    const freq = occurrencesByFrequency[p.frequency || "weekly"] || occurrencesByFrequency.weekly;
    const weekly = perOcc * (freq.weekly ?? 0);
    const monthly = perOcc * (freq.monthly ?? 0);
    return { weekly, monthly };
  };

  const painSummary = useMemo(() => {
    return painPoints.reduce(
      (acc, p) => {
        const { weekly, monthly } = calcPainLoss(p);
        acc.weekly += weekly;
        acc.monthly += monthly;
        return acc;
      },
      { weekly: 0, monthly: 0 }
    );
  }, [painPoints]);

  const renderPainBadge = (p, collaboratorsList = []) => {
    const severityColor = p.severity >= 4 ? "danger" : p.severity >= 3 ? "warning" : "brand";
    const collaboratorText = collaboratorsList.length ? ` • with ${collaboratorsList.join(", ")}` : "";
    return (
      <Badge appearance="filled" color={severityColor} shape="rounded" size="medium" key={`${p.task || p.title}-${collaboratorText}`}>
        {p.task || p.title}
        {collaboratorText}
      </Badge>
    );
  };

  const renderModalContent = () => {
    switch (openForm) {
      case "role":
        return (
          <div className={styles.stack}>
            <Field label="Role" required>
              <Input placeholder="e.g., Customer Support Specialist" value={roleName} onChange={(_, d) => setRoleName(d.value)} />
            </Field>
            <Field label="Number of employees">
              <Input type="number" min={0} placeholder="e.g., 15" value={headcount} onChange={(_, d) => setHeadcount(d.value)} />
            </Field>
            <Field label="Description">
              <Textarea rows={3} placeholder="What does a typical day look like?" value={description} onChange={(_, d) => setDescription(d.value)} />
            </Field>
          </div>
        );
      case "goals":
        return (
          <AddableList
            label="Goal"
            placeholder="Add a goal"
            items={goals}
            onAdd={(v) => setGoals([...goals, v])}
            onRemove={(idx) => setGoals(goals.filter((_, i) => i !== idx))}
          />
        );
      case "tools":
        return (
          <AddableList
            label="Tool"
            placeholder="Add a tool"
            items={tools}
            onAdd={(v) => setTools([...tools, v])}
            onRemove={(idx) => setTools(tools.filter((_, i) => i !== idx))}
          />
        );
      case "solo":
        return (
          <div className={styles.stack}>
            <Field label="Task">
              <div style={{ display: "flex", gap: tokens.spacingHorizontalXS, alignItems: "center" }}>
                <Input
                  placeholder="e.g., Daily reconciliations"
                  value={soloTaskInput.title}
                  onChange={(_, d) => setSoloTaskInput({ ...soloTaskInput, title: d.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSoloTask();
                    }
                  }}
                />
                <Combobox
                  style={{ width: "140px" }}
                  value={soloTaskInput.frequency}
                  onOptionSelect={(_, data) =>
                    setSoloTaskInput({ ...soloTaskInput, frequency: data.optionValue || data.value || "weekly" })
                  }
                  onChange={(_, d) => setSoloTaskInput({ ...soloTaskInput, frequency: d.value })}
                >
                  {["daily", "weekly", "monthly", "adhoc"].map((f) => (
                    <Option key={f} value={f}>
                      {f}
                    </Option>
                  ))}
                </Combobox>
              </div>
            </Field>
            <TagGroup aria-label="Individual tasks" style={{ marginTop: tokens.spacingVerticalS, flexWrap: "wrap" }}>
              {soloTasks.length === 0 && <Text className={styles.muted}>No individual tasks yet.</Text>}
              {soloTasks.map((t, idx) => (
                <Tag
                  key={`${t.title}-${idx}`}
                  dismissible
                  onDismiss={() => removeSoloTask(idx)}
                  shape="rounded"
                  appearance="filled"
                  color="brand"
                  size="medium"
                >
                  {`${t.title} (${t.frequency})`}
                </Tag>
              ))}
            </TagGroup>
          </div>
        );
      case "collaborators":
        return (
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
              {collaborators.length === 0 && <Text className={styles.muted}>No collaborators yet.</Text>}
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
        );
      default:
        return null;
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={`${styles.shell} ${styles.layout}`}>
        <div className={styles.navRail}>
          <Text weight="semibold">Workspace</Text>
          <MenuList aria-label="Workspace navigation">
            <div className={styles.navLabel}>Role setup</div>
            <MenuItem icon={<Add16Regular />} onClick={() => setOpenForm("role")}>
              Role definition
            </MenuItem>
            <MenuItem icon={<Toolbox16Regular />} onClick={() => setOpenForm("tools")}>
              Tools
            </MenuItem>
            <MenuItem icon={<Add16Regular />} onClick={() => setOpenForm("solo")}>
              Non-collab tasks
            </MenuItem>
            <MenuItem icon={<PeopleCommunity16Regular />} onClick={() => setOpenForm("collaborators")}>
              Collaborators & tasks
            </MenuItem>
            <MenuItem icon={<Target16Regular />} onClick={() => setOpenForm("goals")}>
              Goals
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<Add16Regular />} onClick={saveRoleSnapshot}>
              Save role
            </MenuItem>
            <MenuItem icon={<Add16Regular />} onClick={resetRole}>
              New role
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => setIsFacilitator((v) => !v)}>
              {isFacilitator ? "Exit facilitator" : "Facilitator view"}
            </MenuItem>
          </MenuList>
          {savedRoles.length > 0 && (
            <div className={styles.navGroup}>
              <div className={styles.navLabel}>Saved roles</div>
              {savedRoles.map((r) => (
                <Button
                  key={r.id}
                  appearance="secondary"
                  size="small"
                  onClick={() => {
                    setRoleName(r.roleName || "");
                    setHeadcount(r.headcount || "");
                    setDescription(r.description || "");
                    setGoals(r.goals || []);
                    setTools(r.tools || []);
                    setSoloTasks(r.soloTasks || []);
                    setCollaborators(r.collaborators || []);
                    setPainPoints(r.painPoints || []);
                    setNodePositions(r.nodePositions || {});
                  }}
                >
                  {r.name}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div>
        {isFacilitator ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(420px, 1fr))", gap: tokens.spacingHorizontalL }}>
            <Card style={{ height: "100%" }}>
              <CardHeader
                header={<Subtitle2>Role snapshot</Subtitle2>}
                description={<Text className={styles.muted}>Everything for this role in one place.</Text>}
              />
              <div className={styles.stack}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: tokens.spacingHorizontalM, alignItems: "flex-start" }}>
                  <div>
                    <Title3>{roleName || "Role not set"}</Title3>
                    <Text size={200}>Headcount: {headcount || "—"}</Text>
                    <Text size={300} className={styles.muted} style={{ maxWidth: "320px" }}>
                      {description || "No description yet."}
                    </Text>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXS }}>
                    <Text size={200} weight="semibold">Pain impact</Text>
                    <Text size={200}>Weekly loss: {formatMinutes(painSummary.weekly)}</Text>
                    <Text size={200}>Monthly loss: {formatMinutes(painSummary.monthly)}</Text>
                  </div>
                </div>
                <Divider />
                <div className={styles.stack}>
                  <Text weight="semibold">Isolated pain points</Text>
                  <div style={{ display: "flex", gap: tokens.spacingHorizontalS, flexWrap: "wrap" }}>
                    {isolatedPainPoints.length === 0 && <Text className={styles.muted}>None captured.</Text>}
                    {isolatedPainPoints.map((p, idx) => (
                      <React.Fragment key={`iso-${idx}`}>{renderPainBadge(p)}</React.Fragment>
                    ))}
                  </div>
                  <Text weight="semibold" style={{ marginTop: tokens.spacingVerticalS }}>
                    Collaborative pain points
                  </Text>
                  <div style={{ display: "flex", gap: tokens.spacingHorizontalS, flexWrap: "wrap" }}>
                    {collaborativePainPoints.length === 0 && <Text className={styles.muted}>None captured.</Text>}
                    {collaborativePainPoints.map((p, idx) => {
                      const collabs = sharedTasksMap[p.task || p.title] || [];
                      return <React.Fragment key={`collab-${idx}`}>{renderPainBadge(p, collabs)}</React.Fragment>;
                    })}
                  </div>
                  <Text weight="semibold" style={{ marginTop: tokens.spacingVerticalS }}>Individual tasks</Text>
                  <TagGroup aria-label="Individual tasks (facilitator)" style={{ flexWrap: "wrap", gap: tokens.spacingHorizontalXS }}>
                    {soloTasks.length === 0 && <Text className={styles.muted}>No individual tasks yet.</Text>}
                    {soloTasks.map((t, idx) => (
                      <Tag
                        key={`${t.title}-${idx}`}
                        appearance="outline"
                        shape="rounded"
                        dismissible
                        onDismiss={() => removeSoloTask(idx)}
                        onClick={(e) => {
                          e.stopPropagation?.();
                          openPainForTask(t.title);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {t.title} ({t.frequency})
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
        <div className={styles.rowTwo}>
          <Card>
            <CardHeader
              header={<Subtitle2>Individual (non-collaborative) tasks</Subtitle2>}
              description={<Text className={styles.muted}>Repetitive tasks owned by this role only.</Text>}
            />
            <TagGroup aria-label="Individual tasks" style={{ marginTop: tokens.spacingVerticalS, flexWrap: "wrap", gap: tokens.spacingHorizontalXS }}>
              {soloTasks.length === 0 && <Text className={styles.muted}>No individual tasks yet.</Text>}
              {soloTasks.map((t, idx) => (
                <Tag
                  key={`${t.title}-${idx}`}
                  dismissible
                  onDismiss={() => removeSoloTask(idx)}
                  shape="rounded"
                  appearance="outline"
                  onClick={(e) => {
                    e.stopPropagation?.();
                    openPainForTask(t.title);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ fontWeight: 600 }}>{t.title}</span>&nbsp;
                  <Text size={200} color="neutral">{`(${t.frequency})`}</Text>
                </Tag>
              ))}
            </TagGroup>
          </Card>

          <Card>
            <CardHeader header={<Subtitle2>Tools</Subtitle2>} description={<Text className={styles.muted}>Systems and instruments.</Text>} />
            <TagGroup
              aria-label="Tools"
              style={{ marginTop: tokens.spacingVerticalS, display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalXS }}
            >
              {tools.length === 0 && <Text className={styles.muted}>No tools yet.</Text>}
              {tools.map((tool, idx) => (
                <Tag
                  key={`${tool}-${idx}`}
                  dismissible
                  onDismiss={() => setTools((prev) => prev.filter((_, i) => i !== idx))}
                  shape="rounded"
                  appearance="filled"
                  color="brand"
                  size="medium"
                >
                  {tool}
                </Tag>
              ))}
            </TagGroup>
          </Card>
        </div>

        <div className={styles.rowThree}>
          <Card>
            <CardHeader header={<Subtitle2>Collaborators & Tasks</Subtitle2>} description={<Text className={styles.muted}>Link collaborators to this role and map shared tasks.</Text>} />
            <div className={styles.collaborators}>
              {collaborators.length === 0 && <Text className={styles.muted}>No collaborators yet. Add one via the toolbar.</Text>}
              {collaborators.map((collab, idx) => (
                <Card key={collab.name + idx} className={styles.collaboratorBlock}>
                  <div className={styles.collaboratorHeader}>
                    <Subtitle2>{collab.name}</Subtitle2>
                    <Button appearance="subtle" icon={<Delete16Regular />} aria-label="Remove" onClick={() => removeCollaborator(idx)} />
                  </div>
                  <Text size={200} className={styles.muted}>
                    Tasks: {collab.tasks.length || 0} • Tools: {collab.tools?.length || 0}
                  </Text>
                </Card>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader header={<Subtitle2>Goals</Subtitle2>} description={<Text className={styles.muted}>Desired outcomes.</Text>} />
            <TagGroup aria-label="Goals" style={{ marginTop: tokens.spacingVerticalS, flexWrap: "wrap" }}>
              {goals.length === 0 && <Text className={styles.muted}>No goals yet.</Text>}
              {goals.map((goal, idx) => (
                <Tag
                  key={`${goal}-${idx}`}
                  dismissible
                  onDismiss={() => setGoals(goals.filter((_, i) => i !== idx))}
                  shape="rounded"
                  appearance="filled"
                  color="brand"
                  size="medium"
                >
                  {goal}
                </Tag>
              ))}
            </TagGroup>
          </Card>
        </div>

        <div className={styles.rowFull}>
          <Card className={styles.wideCard}>
            <CardHeader
              header={<Subtitle2>Collaboration Map</Subtitle2>}
              description={<Text className={styles.muted}>Visio-style visualization of the role and collaborator links with shared tasks.</Text>}
            />
            <div className={`${styles.diagramWrap} ${diagramExpanded ? `${styles.diagramExpanded} ${styles.diagramWrapExpanded}` : ""}`}>
              <div className={styles.overlayFooter}>
                <div className={styles.topNav}>
                  <div className={styles.topNavLeft}>
                    <Switch checked={diagramExpanded} onChange={(_, data) => setDiagramExpanded(data.checked)} label="Expand to full screen" />
                    {diagramExpanded && (
                      <Button appearance="primary" icon={<Add16Regular />} onClick={() => setPainMenuOpen((prev) => !prev)}>
                        Add pain point
                      </Button>
                    )}
                  </div>
                  {diagramExpanded && <Text weight="semibold">Shared tasks appear along the connector lines.</Text>}
                </div>
                {diagramExpanded && painMenuOpen && (
                  <Card
                    appearance="subtle"
                    style={{ padding: tokens.spacingHorizontalM, width: "620px", maxWidth: "640px", marginTop: tokens.spacingVerticalS }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: tokens.spacingVerticalM,
                        width: "100%"
                      }}
                    >
                      <Field label="Task (shared or not)">
                        <Combobox
                          placeholder="Select or type a task"
                          freeform
                          value={painForm.task}
                          style={{ width: "100%" }}
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
                      <Field label={`Severity (${painForm.severity}/5)`} hint={severityLabel[painForm.severity]}>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={painForm.severity}
                          onChange={(_, data) => setPainForm({ ...painForm, severity: data.value })}
                        />
                      </Field>
                      <Field label="Frequency">
                        <Combobox
                          value={painForm.frequency}
                          style={{ width: "100%" }}
                          onOptionSelect={(_, data) =>
                            setPainForm({ ...painForm, frequency: data.optionValue || data.value || "weekly" })
                          }
                          onChange={(_, data) => setPainForm({ ...painForm, frequency: data.value })}
                        >
                          {["daily", "weekly", "monthly", "adhoc"].map((f) => (
                            <Option key={f} value={f}>
                              {f}
                            </Option>
                          ))}
                        </Combobox>
                      </Field>
                      <Field label="Duration (per occurrence)">
                        <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
                          <Input
                            type="number"
                            min={0}
                            placeholder="e.g., 30"
                            value={painForm.durationValue}
                            style={{ width: "100%" }}
                            onChange={(_, d) => setPainForm({ ...painForm, durationValue: d.value })}
                          />
                          <Combobox
                            value={painForm.durationUnit}
                            style={{ width: "120px" }}
                            onOptionSelect={(_, data) =>
                              setPainForm({ ...painForm, durationUnit: data.optionValue || data.value || "minutes" })
                            }
                            onChange={(_, data) => setPainForm({ ...painForm, durationUnit: data.value })}
                          >
                            <Option value="minutes">minutes</Option>
                            <Option value="hours">hours</Option>
                          </Combobox>
                        </div>
                      </Field>
                      <Field label="Cost / risk">
                        <Input
                          placeholder="$500/week"
                          value={painForm.cost}
                          style={{ width: "100%" }}
                          onChange={(_, d) => setPainForm({ ...painForm, cost: d.value })}
                        />
                      </Field>
                      <Field label="Friction type (max 2)">
                        <Combobox
                          multiselect
                          value={painForm.frictionTypes}
                          style={{ width: "100%" }}
                          onOptionSelect={(_, data) => {
                            const option = data.optionValue || data.value;
                            if (!option) return;
                            setPainForm((prev) => {
                              const current = new Set(prev.frictionTypes || []);
                              if (current.has(option)) {
                                current.delete(option);
                              } else if (current.size < 2) {
                                current.add(option);
                              }
                              return { ...prev, frictionTypes: Array.from(current) };
                            });
                          }}
                        >
                          {[
                            "Delay (waiting for info, approvals, input)",
                            "Rework (fixing errors, re-doing work)",
                            "Manual effort (copy/paste, chasing info)",
                            "Decision bottleneck (waiting for judgement)",
                            "Handover friction (Cross-team dependencies)",
                            "Tool mismatch (wrong or missing system)",
                            "Compliance/ control burden (over-checking, audit steps)"
                          ].map((f) => (
                            <Option key={f} value={f}>
                              {f}
                            </Option>
                          ))}
                        </Combobox>
                      </Field>
                      <Field label="Why is it painful?">
                        <Textarea
                          placeholder="Describe the impact"
                          value={painForm.description}
                          style={{ width: "100%" }}
                          rows={3}
                          onChange={(_, d) => setPainForm({ ...painForm, description: d.value })}
                        />
                      </Field>
                      <div style={{ display: "flex", gap: tokens.spacingHorizontalS, justifyContent: "space-between" }}>
                        <Text size={200}>
                          Weekly loss:{" "}
                          {formatMinutes(
                            (Number(painForm.durationValue) || 0) *
                              (painForm.durationUnit === "hours" ? 60 : 1) *
                              (occurrencesByFrequency[painForm.frequency || "weekly"]?.weekly || 0)
                          )}
                        </Text>
                        <Text size={200}>
                          Monthly loss:{" "}
                          {formatMinutes(
                            (Number(painForm.durationValue) || 0) *
                              (painForm.durationUnit === "hours" ? 60 : 1) *
                              (occurrencesByFrequency[painForm.frequency || "weekly"]?.monthly || 0)
                          )}
                        </Text>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: tokens.spacingHorizontalS }}>
                        <Button onClick={() => setPainMenuOpen(false)}>Cancel</Button>
                        <Button
                          appearance="primary"
                          icon={<Add16Regular />}
                          disabled={!painForm.task.trim()}
                          onClick={() => {
                            addPainPoint();
                            setPainMenuOpen(false);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
              <Diagram
                roleName={roleName || "Role"}
                collaborators={collaborators}
                sharedTasksMap={sharedTasksMap}
                sharedToolsMap={sharedToolsMap}
                painPoints={painPoints}
                soloTasks={soloTasks}
                expanded={diagramExpanded}
                nodePositions={nodePositions}
                setNodePositions={setNodePositions}
                onTaskSelect={openPainForTask}
                ref={diagramRef}
              />
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
      </>
      )}
      </div>
      </div>
      <Dialog open={!!openForm} onOpenChange={(_, data) => setOpenForm(data.open ? openForm : null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {openForm === "role" && "Role definition"}
              {openForm === "collaborators" && "Add collaborators & shared tasks"}
              {openForm === "solo" && "Add non-collaborative task"}
              {openForm === "tools" && "Add tools"}
              {openForm === "goals" && "Add goals"}
            </DialogTitle>
            <DialogContent>{renderModalContent()}</DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setOpenForm(null)}>
                Close
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  );
};

export default App;
