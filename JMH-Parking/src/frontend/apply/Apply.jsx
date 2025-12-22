import classes from "./styles/apply.module.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  Paper,
  Title,
  Stack,
  TextInput,
  Group,
  Button,
  Alert,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  throw new Error("VITE_API_BASE is not set. Add it to your frontend .env");
}


async function postParker(payload) {
  const res = await fetch(`${API_BASE}/parkers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Reusable form for posting to /parkers ---
function ParkerForm({ employmentType }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const f = firstName.trim();
    const l = lastName.trim();

    if (!f || !l) {
      setError("Please enter both first and last name.");
      return;
    }
    if (f.length > 15 || l.length > 15) {
      setError("Names must be 15 characters or fewer.");
      return;
    }

    try {
      setLoading(true);
      const created = await postParker({ firstName: f, lastName: l });
      setSuccess(
        `Saved ${created.firstName} ${created.lastName} (${employmentType}). Created at: ${new Date(
          created.created_at
        ).toLocaleString()}`
      );
      setFirstName("");
      setLastName("");
    } catch (err) {
      setError(err?.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  const pretty = employmentType
    ? employmentType[0].toUpperCase() + employmentType.slice(1)
    : "Application";

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="sm">{pretty} Application</Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              label="First name"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              maxLength={15}
              required
            />
            <TextInput
              label="Last name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              maxLength={15}
              required
            />
          </Group>

          <Text c="dimmed" size="sm">
            This demo posts only name fields to <code>/parkers</code>. We can
            extend it later with all required application fields.
          </Text>

          {error && (
            <Alert color="red" icon={<IconAlertCircle />} variant="light">
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="green" icon={<IconCheck />} variant="light">
              {success}
            </Alert>
          )}

          <Group justify="flex-end">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

// Per-view components now just mount the form
function FullTimeView()  { return <ParkerForm employmentType="full-time" />; }
function PartTimeView()  { return <ParkerForm employmentType="part-time" />; }
function StudentView()   { return <ParkerForm employmentType="student" />; }

const VIEW_MAP = {
  "full-time": FullTimeView,
  "part-time": PartTimeView,
  "student": StudentView,
};

export default function Apply() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "");

  // keep URL in sync when user changes selection
  useEffect(() => {
    if (type) setSearchParams({ type });
    else setSearchParams({});
  }, [type, setSearchParams]);

  const ViewComponent = useMemo(() => VIEW_MAP[type] || null, [type]);

  return (
    <Stack gap="md" p="md" className={classes.applyPage}>
      <Title order={2}>Choose employment type</Title>
      <Select
        placeholder="Select type"
        data={[
          { value: "full-time", label: "Full-time" },
          { value: "part-time", label: "Part-time" },
          { value: "student", label: "Student" },
        ]}
        value={type}
        onChange={(v) => setType(v || "")}  // Mantine returns value or null
        clearable
      />

      {!type && (
        <Paper p="md" withBorder>
          Select an employment type to see the relevant application.
        </Paper>
      )}

      {ViewComponent && <ViewComponent />}
    </Stack>
  );
}
