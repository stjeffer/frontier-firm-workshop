import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Combobox,
  Field,
  Input,
  MenuItem,
  MenuList,
  Option,
  Slider,
  Subtitle2,
  Text,
  Textarea,
  Title3,
  Tag,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
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
    width: "100%",
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 22px)",
    cursor: "crosshair",
    overflow: "auto"
  },
  node: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: "8px 12px",
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    minWidth: "120px",
    userSelect: "none",
    height: "64px"
  },
  nodeLabel: {
    fontWeight: 700,
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "180px"
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
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
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
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: tokens.spacingHorizontalM,
    width: "100%"
  },
  canvasInner: {
    position: "absolute",
    inset: 0,
    transformOrigin: "0 0"
  },
  zoomBar: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS
  },
  floatingControls: {
    position: "absolute",
    top: tokens.spacingHorizontalM,
    right: tokens.spacingHorizontalM,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    zIndex: 5,
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`
  }
});

const STORAGE_KEY = "processOptimizationSession";

const severityColor = (value) => {
  if (value >= 4) return "danger";
  if (value >= 3) return "warning";
  return "brand";
};

const stepTypes = [
  {
    key: "swimlane",
    label: "Swimlane",
    color: "#111827",
    limit: 6,
    fields: [
      { key: "role", label: "Role name" },
      { key: "department", label: "Department" }
    ]
  },
  {
    key: "trigger",
    label: "Trigger",
    color: "#22c55e",
    limit: 4,
    fields: [
      { key: "description", label: "What starts the process?" },
      { key: "source", label: "Source system or actor" }
    ]
  },
  {
    key: "action",
    label: "Action",
    color: "#2563eb",
    limit: 10,
    fields: [
      { key: "description", label: "Action description" },
      { key: "owner", label: "Owner" },
      { key: "tool", label: "System / tool used" }
    ]
  },
  {
    key: "decision",
    label: "Decision",
    color: "#facc15",
    limit: 6,
    fields: [
      { key: "question", label: "Question / condition" },
      { key: "outcomes", label: "Possible outcomes" }
    ]
  },
  {
    key: "parallel",
    label: "Parallel",
    color: "#7c3aed",
    limit: 4,
    fields: [
      { key: "tasks", label: "Parallel tasks" },
      { key: "roles", label: "Roles involved" }
    ]
  },
  {
    key: "handoff",
    label: "Handoff",
    color: "#fbbf24",
    limit: 4,
    fields: [
      { key: "from", label: "From role" },
      { key: "to", label: "To role" },
      { key: "trigger", label: "Trigger condition" }
    ]
  },
  {
    key: "end",
    label: "End",
    color: "#ef4444",
    limit: 4,
    fields: [
      { key: "description", label: "End state description" },
      { key: "artifact", label: "Output artifact" }
    ]
  },
  {
    key: "exception",
    label: "Exception",
    color: "#e11d48",
    limit: 6,
    fields: [
      { key: "type", label: "Exception type" },
      { key: "resolution", label: "Resolution path" }
    ]
  },
  {
    key: "wait",
    label: "Wait",
    color: "#6b7280",
    limit: 4,
    fields: [
      { key: "time", label: "Time" },
      { key: "description", label: "Description" }
    ]
  }
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

const ProcessOptimization = ({ onBack, onSaveProcess }) => {
  const styles = useStyles();
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [connections, setConnections] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [linkingFrom, setLinkingFrom] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [processInfo, setProcessInfo] = useState({ name: "", description: "", businessUnit: "" });
  const [painForm, setPainForm] = useState({ title: "", stepId: "", severity: 3, description: "" });
  const [painPoints, setPainPoints] = useState([]);
  const baseWidth = 1400;
  const baseHeight = 900;
  const typeCounts = useMemo(() => {
    return steps.reduce((acc, step) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {});
  }, [steps]);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [painOpen, setPainOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setSteps(
        (parsed.steps || []).map((s) => {
          const def = stepTypes.find((d) => d.key === s.type);
          const meta = (def?.fields || []).reduce(
            (acc, f) => ({ ...acc, [f.key]: s.meta?.[f.key] ?? "" }),
            {}
          );
          return { ...s, meta };
        })
      );
      setConnections(parsed.connections || []);
      setProcessInfo(parsed.processInfo || { name: "", description: "", businessUnit: "" });
      setPainPoints(parsed.painPoints || []);
      setZoom(parsed.zoom || 1);
    } catch (err) {
      console.warn("Failed to load saved process session", err);
    }
  }, []);

  const clampZoom = (val) => Math.min(2, Math.max(0.5, val));
  const handleZoom = (delta) => setZoom((z) => clampZoom(z + delta));

  const handleSave = () => {
    const id = processInfo.id || `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const payload = {
      id,
      steps,
      connections,
      processInfo: { ...processInfo, id },
      painPoints,
      zoom
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setProcessInfo((prev) => ({ ...prev, id }));
    onSaveProcess?.(payload);
  };

  const handleClear = () => {
    setSteps([]);
    setConnections([]);
    setPainPoints([]);
    setSelectedStep(null);
    setLinkingFrom(null);
  };

  const addStep = (type, x, y) => {
    const def = stepTypes.find((s) => s.key === type);
    if (!def) return;
    const currentCount = steps.filter((s) => s.type === type).length;
    if (def.limit && currentCount >= def.limit) return;
    const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const newStep = {
      id,
      type,
      name: def.label,
      x,
      y,
      notes: "",
      meta: (def.fields || []).reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
    };
    setSteps((prev) => [...prev, newStep]);
    setSelectedStep(newStep);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
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
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left) / zoom - step.x;
    const offsetY = (e.clientY - rect.top) / zoom - step.y;
    setDragging({ id: step.id, offsetX, offsetY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX = (e.clientX - rect.left) / zoom - dragging.offsetX;
    const nextY = (e.clientY - rect.top) / zoom - dragging.offsetY;
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

  const stepOptions = useMemo(
    () => steps.map((s) => ({ value: s.id, label: s.name || s.type })),
    [steps]
  );

  const addPainPoint = () => {
    const title = painForm.title.trim();
    if (!title) return;
    setPainPoints((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        title,
        stepId: painForm.stepId,
        severity: painForm.severity,
        description: painForm.description.trim()
      }
    ]);
    setPainForm({ title: "", stepId: "", severity: 3, description: "" });
  };

  const closeContextMenu = () => setContextMenu(null);

  const selected = steps.find((s) => s.id === selectedStep?.id) || null;

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Text weight="semibold">Process optimization canvas</Text>
        <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
          {onBack && (
            <Button appearance="secondary" onClick={onBack} icon={<ArrowHookUpRight16Regular />}>
              Back
            </Button>
          )}
          <Button appearance="primary" icon={<ArrowCircleDownRight16Regular />} onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      <Card className={styles.canvasCard} style={{ minHeight: "82vh" }}>
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
          <div className={styles.floatingControls}>
            <Field label="Name">
              <Input
                value={processInfo.name}
                placeholder="Process name"
                onChange={(_, d) => setProcessInfo({ ...processInfo, name: d.value })}
              />
            </Field>
            <Field label="Business unit">
              <Input
                value={processInfo.businessUnit}
                placeholder="e.g., Ops"
                onChange={(_, d) => setProcessInfo({ ...processInfo, businessUnit: d.value })}
              />
            </Field>
            <Field label="Description">
              <Input
                value={processInfo.description}
                placeholder="Short description"
                onChange={(_, d) => setProcessInfo({ ...processInfo, description: d.value })}
              />
            </Field>
            <div className={styles.zoomBar}>
              <Button appearance="secondary" onClick={handleSave}>
                Save
              </Button>
              <Button appearance="secondary" onClick={() => setInspectorOpen(true)}>
                Inspector
              </Button>
              <Button appearance="secondary" onClick={() => setPainOpen(true)}>
                Pain points
              </Button>
              <Text size={200} color="neutral">Zoom</Text>
              <Button size="small" onClick={() => handleZoom(-0.1)}>-</Button>
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                value={zoom}
                onChange={(_, data) => setZoom(clampZoom(data.value))}
                style={{ width: "120px" }}
              />
              <Button size="small" onClick={() => handleZoom(0.1)}>+</Button>
              <Text size={200} color="neutral">{Math.round(zoom * 100)}%</Text>
            </div>
          </div>
          <div
            ref={contentRef}
            className={styles.canvasInner}
            style={{ transform: `scale(${zoom})`, width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              width={baseWidth}
              height={baseHeight}
              viewBox={`0 0 ${baseWidth} ${baseHeight}`}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
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
                  {isLinking ? (
                    <span className={styles.badge}>Select a target to link</span>
                  ) : (
                    <span className={styles.badge}>Click to connect</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Dialog open={inspectorOpen} onOpenChange={(_, data) => setInspectorOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Inspector</DialogTitle>
            <DialogContent>
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
                    {(stepTypes.find((t) => t.key === selected.type)?.fields || []).map((field) => (
                      <Field key={field.key} label={field.label}>
                        <Input
                          value={selected.meta?.[field.key] || ""}
                          onChange={(_, data) =>
                            setSteps((prev) =>
                              prev.map((s) =>
                                s.id === selected.id ? { ...s, meta: { ...(s.meta || {}), [field.key]: data.value } } : s
                              )
                            )
                          }
                        />
                      </Field>
                    ))}
                    <Button
                      icon={<Dismiss16Regular />}
                      appearance="secondary"
                      onClick={() => {
                        setSteps((prev) => prev.filter((s) => s.id !== selected.id));
                        setConnections((prev) => prev.filter((c) => c.from !== selected.id && c.to !== selected.id));
                        setPainPoints((prev) => prev.filter((p) => p.stepId !== selected.id));
                        setSelectedStep(null);
                      }}
                    >
                      Remove step
                    </Button>
                  </>
                ) : (
                  <Text size={200} color="neutral">
                    Select a step to edit it.
                  </Text>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setInspectorOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={painOpen} onOpenChange={(_, data) => setPainOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Pain points</DialogTitle>
            <DialogContent>
              <div className={styles.inspector}>
                <Field label="Label">
                  <Input
                    value={painForm.title}
                    placeholder="e.g., Approval delay"
                    onChange={(_, d) => setPainForm({ ...painForm, title: d.value })}
                  />
                </Field>
                <Field label="Linked step (optional)">
                  <Combobox
                    value={painForm.stepId}
                    onOptionSelect={(_, data) => setPainForm({ ...painForm, stepId: data.optionValue || data.value || "" })}
                    onChange={(_, d) => setPainForm({ ...painForm, stepId: d.value })}
                    placeholder="Select a step"
                  >
                    {stepOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Combobox>
                </Field>
                <Field label={`Severity (${painForm.severity}/5)`}>
                  <Slider min={1} max={5} step={1} value={painForm.severity} onChange={(_, d) => setPainForm({ ...painForm, severity: d.value })} />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={2}
                    value={painForm.description}
                    onChange={(_, d) => setPainForm({ ...painForm, description: d.value })}
                    placeholder="Impact, frequency, or notes"
                  />
                </Field>
                <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
                  <Button appearance="primary" onClick={addPainPoint} disabled={!painForm.title.trim()}>
                    Add pain point
                  </Button>
                  <Button appearance="secondary" onClick={() => setPainForm({ title: "", stepId: "", severity: 3, description: "" })}>
                    Reset
                  </Button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalXS }}>
                  {painPoints.length === 0 && <Text className={styles.muted}>No pain points yet.</Text>}
                  {painPoints.map((p) => (
                    <Tag
                      key={p.id}
                      shape="rounded"
                      appearance="outline"
                      color={severityColor(p.severity)}
                      dismissible
                      onDismiss={() => setPainPoints((prev) => prev.filter((pp) => pp.id !== p.id))}
                    >
                      {p.title}
                      {p.stepId ? ` • ${steps.find((s) => s.id === p.stepId)?.name || "Step"}` : ""}
                    </Tag>
                  ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setPainOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

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
                disabled={type.limit ? (typeCounts[type.key] || 0) >= type.limit : false}
                onClick={() => {
                  addStep(type.key, contextMenu.canvasX, contextMenu.canvasY);
                  closeContextMenu();
                }}
              >
                {type.label}
                {type.limit ? (
                  <span style={{ marginLeft: tokens.spacingHorizontalXS, color: tokens.colorNeutralForeground3 }}>
                    ({Math.max(0, type.limit - (typeCounts[type.key] || 0))} left)
                  </span>
                ) : null}
              </MenuItem>
            ))}
          </MenuList>
        </div>
      ) : null}
    </div>
  );
};

export default ProcessOptimization;
