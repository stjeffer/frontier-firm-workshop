import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Combobox,
  Field,
  Input,
  Option,
  Subtitle2,
  Text,
  Textarea,
  makeStyles,
  tokens
} from "@fluentui/react-components";
import {
  Add16Regular,
  Delete16Regular,
  Save16Regular,
  ArrowLeft16Regular,
  Person24Regular,
  Pin24Regular,
  Laptop24Regular,
  ThumbLike24Regular,
  Flash24Regular,
  BranchFork24Regular,
  TargetArrow24Regular,
  ArrowTrendingSparkle24Regular,
  Hourglass24Regular
} from "@fluentui/react-icons";

const STORAGE_KEY = "reimaginedExperienceSession";

const artifactTypes = [
  { key: "persona", label: "Persona", color: "#2563eb", bg: "rgba(37,99,235,0.12)", icon: Person24Regular, prompt: "Who is involved?" },
  { key: "moment", label: "Moment", color: "#d97706", bg: "rgba(217,119,6,0.12)", icon: Pin24Regular, prompt: "When/where does this happen?" },
  { key: "touchpoint", label: "Touchpoint", color: "#a855f7", bg: "rgba(168,85,247,0.12)", icon: Laptop24Regular, prompt: "Where does the interaction occur?" },
  { key: "feeling", label: "Feeling", color: "#0f766e", bg: "rgba(15,118,110,0.12)", icon: ThumbLike24Regular, prompt: "What emotions show up?" },
  { key: "friction", label: "Friction", color: "#ea580c", bg: "rgba(234,88,12,0.12)", icon: Flash24Regular, prompt: "What slows people down?" },
  { key: "choice", label: "Choice", color: "#d97706", bg: "rgba(217,119,6,0.12)", icon: BranchFork24Regular, prompt: "What decisions are made?" },
  { key: "outcome", label: "Outcome", color: "#16a34a", bg: "rgba(22,163,74,0.12)", icon: TargetArrow24Regular, prompt: "What success looks like?" },
  { key: "opportunity", label: "Opportunity", color: "#6366f1", bg: "rgba(99,102,241,0.14)", icon: ArrowTrendingSparkle24Regular, prompt: "Where can we improve?" },
  { key: "wait", label: "Wait", color: "#6b7280", bg: "rgba(107,114,128,0.12)", icon: Hourglass24Regular, prompt: "Where do we pause or delay?" }
];

const useStyles = makeStyles({
  shell: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalXL,
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.spacingHorizontalM
  },
  topBarLeft: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: tokens.spacingHorizontalL,
    alignItems: "start"
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
    height: "620px",
    width: "100%",
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(37,99,235,0.06) 0, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 24px)",
    cursor: "default",
    overflow: "hidden"
  },
  node: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    width: "170px",
    minHeight: "120px",
    userSelect: "none"
  },
  nodeHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS
  },
  linkHint: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3
  },
  canvasToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`
  },
  contextMenu: {
    position: "fixed",
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 20,
    display: "grid",
    gap: tokens.spacingVerticalXXS
  },
  artifactCard: {
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingHorizontalM,
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gap: tokens.spacingVerticalM,
    boxShadow: tokens.shadow8,
    position: "relative"
  },
  artifactIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: tokens.shadow8
  },
  artifactHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS
  },
  badge: {
    borderRadius: "999px",
    padding: "2px 10px",
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS
  },
  qty: {
    fontWeight: 700,
    color: tokens.colorNeutralForeground1
  },
  closeButton: {
    position: "absolute",
    top: tokens.spacingVerticalS,
    right: tokens.spacingHorizontalS
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalS
  }
});

const emptyInfo = { name: "", description: "", businessUnit: "", scenario: "" };

const ReimaginedExperience = ({ onBack, onSaveExperience }) => {
  const styles = useStyles();
  const [experienceInfo, setExperienceInfo] = useState(emptyInfo);
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ type: "persona", detail: "", quantity: 1 });
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [linkingFrom, setLinkingFrom] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setExperienceInfo(parsed.experienceInfo || emptyInfo);
      setCards(parsed.cards || []);
      setNodes(parsed.nodes || []);
      setConnections(parsed.connections || []);
    } catch (err) {
      console.warn("Failed to load experience session", err);
    }
  }, []);

  const typeMap = useMemo(() => Object.fromEntries(artifactTypes.map((t) => [t.key, t])), []);
  const typeCounts = useMemo(
    () => cards.reduce((acc, card) => ({ ...acc, [card.type]: (acc[card.type] || 0) + (Number(card.quantity) || 0) }), {}),
    [cards]
  );

  const addCard = () => {
    const detail = newCard.detail.trim();
    if (!detail) return;
    const def = typeMap[newCard.type] || artifactTypes[0];
    const id = `${newCard.type}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const quantity = Math.max(1, Number(newCard.quantity) || 1);
    setCards((prev) => [...prev, { ...newCard, detail, id, label: def.label, quantity }]);
    setNodes((prev) => {
      const row = Math.floor(prev.length / 4);
      const col = prev.length % 4;
      const baseX = 180 + col * 220;
      const baseY = 140 + row * 180;
      return [
        ...prev,
        { id, type: newCard.type, label: def.label, detail, quantity, x: baseX, y: baseY, color: def.color, bg: def.bg }
      ];
    });
    setNewCard((prev) => ({ ...prev, detail: "" }));
  };

  const handleSave = () => {
    const id = experienceInfo.id || `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const payload = {
      id,
      experienceInfo: { ...experienceInfo, id },
      cards,
      nodes,
      connections
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setExperienceInfo((prev) => ({ ...prev, id }));
    onSaveExperience?.(payload);
  };

  const removeCard = (id) => setCards((prev) => prev.filter((c) => c.id !== id));
  const removeNode = (id) => setNodes((prev) => prev.filter((n) => n.id !== id));

  const addNodeAt = (type, x, y) => {
    const def = typeMap[type] || artifactTypes[0];
    const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setNodes((prev) => [...prev, { id, type, label: def.label, detail: def.prompt, quantity: 1, x, y, color: def.color, bg: def.bg }]);
    setContextMenu(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({ pageX: e.clientX, pageY: e.clientY, x, y });
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

  const handlePointerDown = (node) => (e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left) - node.x;
    const offsetY = (e.clientY - rect.top) - node.y;
    setDragging({ id: node.id, offsetX, offsetY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - dragging.offsetX;
    const y = e.clientY - rect.top - dragging.offsetY;
    setNodes((prev) => prev.map((n) => (n.id === dragging.id ? { ...n, x, y } : n)));
  };

  const handlePointerUp = (e) => {
    if (dragging) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragging(null);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Subtitle2>Experience reimaginer</Subtitle2>
          <Text size={200} className="muted">
            Capture personas, moments, touchpoints, feelings, and opportunities in one view.
          </Text>
        </div>
        <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
          <Button appearance="secondary" icon={<ArrowLeft16Regular />} onClick={onBack}>
            Back
          </Button>
          <Button
            appearance="primary"
            icon={<Save16Regular />}
            onClick={handleSave}
            disabled={!experienceInfo.name.trim() || cards.length === 0}
          >
            Save experience
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader header={<Subtitle2>Experience details</Subtitle2>} />
          <div className={styles.stack}>
            <div className={styles.formRow}>
              <Field label="Experience name" required>
                <Input
                  value={experienceInfo.name}
                  onChange={(_, d) => setExperienceInfo((prev) => ({ ...prev, name: d.value }))}
                  placeholder="Onboarding access journey"
                />
              </Field>
              <Field label="Business unit">
                <Input
                  value={experienceInfo.businessUnit}
                  onChange={(_, d) => setExperienceInfo((prev) => ({ ...prev, businessUnit: d.value }))}
                  placeholder="e.g., IT, HR, Operations"
                />
              </Field>
            </div>
            <div className={styles.formRow}>
              <Field label="Scenario">
                <Input
                  value={experienceInfo.scenario}
                  onChange={(_, d) => setExperienceInfo((prev) => ({ ...prev, scenario: d.value }))}
                  placeholder="When and where this experience happens"
                />
              </Field>
              <Field label="Owner / facilitator">
                <Input
                  value={experienceInfo.owner || ""}
                  onChange={(_, d) => setExperienceInfo((prev) => ({ ...prev, owner: d.value }))}
                  placeholder="Name or team"
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={experienceInfo.description}
                onChange={(_, d) => setExperienceInfo((prev) => ({ ...prev, description: d.value }))}
                placeholder="Short note about the experience you are redesigning."
                rows={3}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader header={<Subtitle2>Add an element</Subtitle2>} />
          <div className={styles.stack}>
            <Field label="Type">
              <Combobox
                value={typeMap[newCard.type]?.label || ""}
                selectedOptions={[newCard.type]}
                onOptionSelect={(_, data) => {
                  setNewCard((prev) => ({ ...prev, type: data.optionValue || prev.type }));
                  const def = typeMap[data.optionValue];
                  if (def && !newCard.detail) {
                    setNewCard((prev) => ({ ...prev, detail: "" }));
                  }
                }}
              >
                {artifactTypes.map((t) => (
                  <Option key={t.key} value={t.key}>
                    {t.label}
                  </Option>
                ))}
              </Combobox>
            </Field>
            <Field label={typeMap[newCard.type]?.prompt || "Detail"} required>
              <Input
                value={newCard.detail}
                onChange={(_, d) => setNewCard((prev) => ({ ...prev, detail: d.value }))}
                placeholder="Describe this element"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCard();
                  }
                }}
              />
            </Field>
            <div className={styles.formRow}>
              <Field label="Quantity">
                <Input
                  type="number"
                  min={1}
                  value={newCard.quantity}
                  onChange={(_, d) => setNewCard((prev) => ({ ...prev, quantity: d.value }))}
                />
              </Field>
              <Field label=" ">
                <Button icon={<Add16Regular />} appearance="primary" style={{ marginTop: tokens.spacingVerticalS }} onClick={addCard}>
                  Add card
                </Button>
              </Field>
            </div>
            <div>
              <Text weight="semibold">Type counts</Text>
              <div className={styles.badgeRow}>
                {artifactTypes.map((t) => (
                  <span key={t.key} className={styles.badge}>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: t.color
                      }}
                    />
                    {t.label}: {typeCounts[t.key] || 0}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          header={<Subtitle2>Experience map</Subtitle2>}
          description={<Text className="muted">Add cards to visualize the full experience.</Text>}
        />
        {cards.length === 0 ? (
          <div style={{ padding: tokens.spacingHorizontalM }}>
            <Text className="muted">No cards yet. Add at least one element to build the view.</Text>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {cards.map((card) => {
              const def = typeMap[card.type] || artifactTypes[0];
              const Icon = def.icon;
              return (
                <div key={card.id} className={styles.artifactCard}>
                  <div className={styles.artifactHeader}>
                    <span className={styles.artifactIcon} style={{ backgroundColor: def.bg, color: def.color }}>
                      <Icon />
                    </span>
                    <div>
                      <Text weight="semibold">{def.label}</Text>
                      <Text size={200} className="muted">
                        {def.prompt}
                      </Text>
                    </div>
                  </div>
                  <Text>{card.detail}</Text>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text size={200} className="muted">
                      Qty {card.quantity}
                    </Text>
                    <Button
                      appearance="subtle"
                      icon={<Delete16Regular />}
                      aria-label="Remove card"
                      onClick={() => removeCard(card.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className={styles.canvasCard}>
        <CardHeader
          header={<Subtitle2>Experience canvas</Subtitle2>}
          description={<Text className="muted">Drag elements, link them, and right-click to add new ones.</Text>}
        />
        <div className={styles.canvasToolbar}>
          <Text size={200} className={styles.linkHint}>
            Tip: Click a node, then another to draw a link. Right-click anywhere to place a new element.
          </Text>
          <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
            <Button appearance="secondary" size="small" onClick={() => { setNodes([]); setConnections([]); setLinkingFrom(null); }}>
              Clear canvas
            </Button>
          </div>
        </div>
        <div
          ref={canvasRef}
          className={styles.canvas}
          onContextMenu={handleContextMenu}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {connections.map((c) => {
              const from = nodes.find((n) => n.id === c.from);
              const to = nodes.find((n) => n.id === c.to);
              if (!from || !to) return null;
              return (
                <g key={c.id} stroke={tokens.colorNeutralStroke2} strokeWidth="2">
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeDasharray="4 3" />
                </g>
              );
            })}
          </svg>
          {nodes.map((node) => {
            const Icon = typeMap[node.type]?.icon || Person24Regular;
            return (
              <div
                key={node.id}
                className={styles.node}
                style={{ left: node.x, top: node.y, borderColor: node.color, cursor: "grab" }}
                onPointerDown={handlePointerDown(node)}
                onClick={() => handleStartLink(node.id)}
              >
                <div className={styles.nodeHeader}>
                  <span className={styles.artifactIcon} style={{ backgroundColor: node.bg || tokens.colorNeutralBackground4, color: node.color }}>
                    <Icon />
                  </span>
                  <div>
                    <Text weight="semibold">{node.label}</Text>
                    <Text size={200} className="muted">
                      Qty {node.quantity || 1}
                    </Text>
                  </div>
                </div>
                <Text size={200}>{node.detail}</Text>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text size={200} className={styles.linkHint}>
                    {linkingFrom === node.id ? "Select a target…" : "Click to link"}
                  </Text>
                  <Button
                    appearance="subtle"
                    icon={<Delete16Regular />}
                    aria-label="Remove node"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                      setConnections((prev) => prev.filter((c) => c.from !== node.id && c.to !== node.id));
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {contextMenu && (
        <div className={styles.contextMenu} style={{ top: contextMenu.pageY, left: contextMenu.pageX }}>
          <Text weight="semibold">Add element here</Text>
          {artifactTypes.map((t) => (
            <Button key={t.key} size="small" onClick={() => addNodeAt(t.key, contextMenu.x, contextMenu.y)}>
              {t.label}
            </Button>
          ))}
          <Button size="small" appearance="subtle" onClick={() => setContextMenu(null)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReimaginedExperience;
