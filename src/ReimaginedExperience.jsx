import React, { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setExperienceInfo(parsed.experienceInfo || emptyInfo);
      setCards(parsed.cards || []);
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
    setNewCard((prev) => ({ ...prev, detail: "" }));
  };

  const handleSave = () => {
    const id = experienceInfo.id || `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const payload = {
      id,
      experienceInfo: { ...experienceInfo, id },
      cards
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setExperienceInfo((prev) => ({ ...prev, id }));
    onSaveExperience?.(payload);
  };

  const removeCard = (id) => setCards((prev) => prev.filter((c) => c.id !== id));

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
    </div>
  );
};

export default ReimaginedExperience;
