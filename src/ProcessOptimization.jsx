import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  MenuItem,
  MenuList,
  Subtitle2,
  Text,
  Title3,
  makeStyles,
  tokens
} from "@fluentui/react-components";
import { ArrowCircleDownRight16Regular, ArrowHookUpRight16Regular, Dismiss16Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  shell: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalXL,
    minHeight: "100vh",
    backgroundColor: "#eef2ff",
    backgroundImage: "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(124,58,237,0.16) 45%, rgba(236,72,153,0.14) 100%)"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.spacingHorizontalM
  },
  canvasCard: {
    position: "relative",
    minHeight: "520px",
    overflow: "hidden",
    boxShadow: tokens.shadow16
  },
  canvas: {
    position: "relative",
    height: "640px",
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 22px)",
    cursor: "crosshair"
  },
  node: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    minWidth: "140px",
    userSelect: "none"
  },
  nodeLabel: {
    fontWeight: 700,
    textAlign: "center"
  },
  instructions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: tokens.spacingHorizontalM
  },
  badge: {
    display: "inline-flex",
    gap: tokens.spacingHorizontalXXS,
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "999px",
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground2,
    fontSize: "12px"
  },
  glyphWrap: {
    width: "104px",
    height: "88px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  contextMenu: {
    position: "fixed",
    zIndex: 20,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow28,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    minWidth: "200px"
  },
  inspector: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM
  }
});

const stepTypes = [
  { key: "swimlane", label: "Swimlane", color: "#111827" },
  { key: "trigger", label: "Trigger", color: "#22c55e" },
  { key: "action", label: "Action", color: "#2563eb" },
  { key: "decision", label: "Decision", color: "#facc15" },
  { key: "parallel", label: "Parallel", color: "#7c3aed" },
  { key: "handoff", label: "Handoff", color: "#fbbf24" },
  { key: "end", label: "End", color: "#ef4444" },
  { key: "exception", label: "Exception", color: "#e11d48" },
  { key: "wait", label: "Wait", color: "#6b7280" }
];

const glyphForType = (type) => {
  switch (type) {
    case "swimlane":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <rect x="4" y="8" width="88" height="56" rx="12" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
          <line x1="22" y1="26" x2="74" y2="26" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          <line x1="22" y1="46" x2="74" y2="46" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "trigger":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <circle cx="48" cy="36" r="26" fill="#22c55e" />
        </svg>
      );
    case "action":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <rect x="18" y="14" width="60" height="44" rx="8" fill="#2563eb" />
        </svg>
      );
    case "decision":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <polygon points="48,10 80,36 48,62 16,36" fill="#facc15" />
        </svg>
      );
    case "parallel":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <path
            d="M40 8 H56 V24 H72 V40 H56 V56 H40 V40 H24 V24 H40 Z"
            fill="#7c3aed"
          />
        </svg>
      );
    case "handoff":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <polygon points="20,28 54,28 54,16 76,36 54,56 54,44 20,44" fill="#fbbf24" />
        </svg>
      );
    case "end":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <circle cx="48" cy="36" r="24" fill="#ef4444" />
        </svg>
      );
    case "exception":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <polygon points="46,10 62,30 50,30 64,58 30,34 42,34 30,10" fill="#e11d48" />
        </svg>
      );
    case "wait":
      return (
        <svg width="96" height="72" viewBox="0 0 96 72">
          <path d="M32 14 L64 14 L54 30 L64 46 L32 46 L42 30 Z" fill="none" stroke="#6b7280" strokeWidth="4" />
          <rect x="34" y="46" width="28" height="12" rx="6" fill="#6b7280" />
        </svg>
      );
    default:
      return null;
  }
};

const ProcessOptimization = ({ onBack }) => {
  const styles = useStyles();
  const canvasRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [connections, setConnections] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [linkingFrom, setLinkingFrom] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [dragging, setDragging] = useState(null);

  const addStep = (type, x, y) => {
    const def = stepTypes.find((s) => s.key === type);
    if (!def) return;
    const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const newStep = {
      id,
      type,
      name: def.label,
      x,
      y,
      notes: ""
    };
    setSteps((prev) => [...prev, newStep]);
    setSelectedStep(newStep);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({
      pageX: e.clientX,
      pageY: e.clientY,
      canvasX: x,
      canvasY: y
    });
  };

  const handleStartLink = (id) => {
    if (linkingFrom && linkingFrom !== id) {
      setConnections((prev) => {
        const exists = prev.some((c) => c.from === linkingFrom && c.to === id);
        if (exists) return prev;
        return [...prev, { id: `${linkingFrom}-${id}-${Date.now()}`, from: linkingFrom, to: id }];
      });
      setLinkingFrom(null);
    } else {
      setLinkingFrom(id);
    }
  };

  const updateStepPosition = (id, x, y) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, x, y } : step))
    );
  };

  const handlePointerDown = (step) => (e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - rect.left - step.x;
    const offsetY = e.clientY - rect.top - step.y;
    setDragging({ id: step.id, offsetX, offsetY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX = e.clientX - rect.left - dragging.offsetX;
    const nextY = e.clientY - rect.top - dragging.offsetY;
    updateStepPosition(dragging.id, nextX, nextY);
  };

  const handlePointerUp = (e) => {
    if (dragging) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
    setDragging(null);
  };

  const connectionPaths = useMemo(() => {
    return connections.map((conn) => {
      const from = steps.find((s) => s.id === conn.from);
      const to = steps.find((s) => s.id === conn.to);
      if (!from || !to) return null;
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 - 16;
      return { ...conn, from, to, d: `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}` };
    }).filter(Boolean);
  }, [connections, steps]);

  const closeContextMenu = () => setContextMenu(null);

  const selected = steps.find((s) => s.id === selectedStep?.id) || null;

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title3>Process optimization canvas</Title3>
          <Text size={200} color="neutral">
            Right-click anywhere to drop a step, then click two steps in sequence to draw a connection.
          </Text>
        </div>
        <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
          {onBack && (
            <Button appearance="secondary" onClick={onBack} icon={<ArrowHookUpRight16Regular />}>
              Back to start
            </Button>
          )}
          <Button appearance="primary" icon={<ArrowCircleDownRight16Regular />} onClick={() => setSteps([])}>
            Clear steps
          </Button>
        </div>
      </div>

      <div className={styles.instructions}>
        <Card>
          <CardHeader
            header={<Subtitle2>How it works</Subtitle2>}
            description={<Text className={styles.badge}>Right-click to add • Click to connect • Drag to move</Text>}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS }}>
            <Text size={200}>Use the canvas on the right to lay out each step in your workflow.</Text>
            <Text size={200}>Start a connection by clicking a step; click a second step to finish the link.</Text>
            <Text size={200}>Drag steps to tidy the flow. The legend below mirrors the process shapes you shared.</Text>
          </div>
        </Card>
        <Card>
          <CardHeader header={<Subtitle2>Legend</Subtitle2>} description={<Text className={styles.badge}>Nine process primitives</Text>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: tokens.spacingHorizontalM }}>
            {stepTypes.map((type) => (
              <div key={type.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacingVerticalXS }}>
                <div className={styles.glyphWrap}>{glyphForType(type.key)}</div>
                <Text weight="semibold">{type.label}</Text>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader header={<Subtitle2>Inspector</Subtitle2>} description={<Text className={styles.badge}>Edit selected step</Text>} />
          <div className={styles.inspector}>
            {selected ? (
              <>
                <Field label="Label">
                  <Input
                    value={selected.name}
                    onChange={(_, data) =>
                      setSteps((prev) =>
                        prev.map((s) => (s.id === selected.id ? { ...s, name: data.value } : s))
                      )
                    }
                  />
                </Field>
                <Field label="Notes">
                  <Input
                    value={selected.notes || ""}
                    onChange={(_, data) =>
                      setSteps((prev) =>
                        prev.map((s) => (s.id === selected.id ? { ...s, notes: data.value } : s))
                      )
                    }
                    placeholder="Add context for this step"
                  />
                </Field>
                <Button
                  icon={<Dismiss16Regular />}
                  appearance="secondary"
                  onClick={() => {
                    setSteps((prev) => prev.filter((s) => s.id !== selected.id));
                    setConnections((prev) => prev.filter((c) => c.from !== selected.id && c.to !== selected.id));
                    setSelectedStep(null);
                  }}
                >
                  Remove step
                </Button>
              </>
            ) : (
              <Text size={200} color="neutral">
                Select a step to edit its label or notes.
              </Text>
            )}
          </div>
        </Card>
      </div>

      <Card className={styles.canvasCard}>
        <CardHeader
          header={<Subtitle2>Process map</Subtitle2>}
          description={<Text className={styles.badge}>{steps.length} step(s) • {connections.length} connection(s)</Text>}
        />
        <div
          ref={canvasRef}
          className={styles.canvas}
          onContextMenu={handleContextMenu}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {connectionPaths.map((conn) => (
              <g key={conn.id} style={{ pointerEvents: "none" }}>
                <path
                  d={conn.d}
                  fill="none"
                  stroke={tokens.colorNeutralStroke2}
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <circle cx={conn.to.x} cy={conn.to.y} r="6" fill={tokens.colorNeutralStroke2} />
              </g>
            ))}
          </svg>

          {steps.map((step) => {
            const isLinking = linkingFrom === step.id;
            return (
              <div
                key={step.id}
                className={styles.node}
                style={{
                  left: `${step.x}px`,
                  top: `${step.y}px`,
                  outline: isLinking || selected?.id === step.id ? `2px solid ${tokens.colorBrandForeground1}` : "none",
                  zIndex: selected?.id === step.id ? 2 : 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStep(step);
                  handleStartLink(step.id);
                }}
                onPointerDown={handlePointerDown(step)}
              >
                <div className={styles.glyphWrap}>{glyphForType(step.type)}</div>
                <Text className={styles.nodeLabel}>{step.name}</Text>
                {step.notes ? <Text size={200} color="neutral">{step.notes}</Text> : null}
                {isLinking ? (
                  <span className={styles.badge}>Select a target to link</span>
                ) : (
                  <span className={styles.badge}>Click to connect</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {contextMenu ? (
        <div
          className={styles.contextMenu}
          style={{ left: contextMenu.pageX, top: contextMenu.pageY }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MenuList aria-label="Add process step">
            {stepTypes.map((type) => (
              <MenuItem
                key={type.key}
                onClick={() => {
                  addStep(type.key, contextMenu.canvasX, contextMenu.canvasY);
                  closeContextMenu();
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </MenuList>
        </div>
      ) : null}
    </div>
  );
};

export default ProcessOptimization;
