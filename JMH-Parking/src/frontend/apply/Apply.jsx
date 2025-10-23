
import classes from "./styles/apply.module.css"

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Select, Paper, Title, Stack } from "@mantine/core";

// Your actual content components
function FullTimeView() { return <Paper p="md">Full-time application content…</Paper>; }
function PartTimeView() { return <Paper p="md">Part-time application content…</Paper>; }
function StudentView()  { return <Paper p="md">Student application content…</Paper>; }

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
    <Stack gap="md" p="md">
      <Title order={2}>Choose employment type</Title>
      <Select
        placeholder="Select type"
        data={[
          { value: "full-time", label: "Full-time" },
          { value: "part-time", label: "Part-time" },
          { value: "student", label: "Student" },
        ]}
        value={type}
        onChange={setType}
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
