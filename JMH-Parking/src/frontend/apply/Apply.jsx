import classes from "./styles/apply.module.css";
import FullTimeApp from "./views/FullTimeApp";
import IndividualAccountApp from "./views/IndividualAccountApp";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import employmentCatalog from "./data/employmentCatalog";

const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  throw new Error("VITE_API_BASE is not set. Add it to your frontend .env");
}

{/* TO BE IMPLEMENTED IN FUTURE VERSIONS
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
*/}
// calls employmentCatalog to get the form component
const FORM_KIND_TO_VIEW = {
  payroll: FullTimeApp,
  ia: IndividualAccountApp,
};

export default function Apply() {
  const [searchParams, setSearchParams] = useSearchParams();
  // URL type param keeps track of selected employment type
  const [type, setType] = useState(searchParams.get("type") || "");

  // keep URL in sync when user changes selection
  useEffect(() => {
    if (type) setSearchParams({ type });
    else setSearchParams({});
  }, [type, setSearchParams]);

  // Turns catalog array into Object for easy lookup
  const catalogByCode = useMemo(() => {
    const map = {};
    for (const item of employmentCatalog) map[item.code] = item;
    return map;
  }, []);

  // Select the relevant catalog item based on Employment type selected
  const selected = catalogByCode[type];
  // Get the form kind from the selected catalog item
  const formKind = selected?.formKind || "";

  // Get the relevant view component based on form kind
  const ViewComponent = useMemo(() => {
    return formKind ? (FORM_KIND_TO_VIEW[formKind] || null) : null;
  }, [formKind]);

  // Select options for the Select component
  const selectData = useMemo(() => {
    return employmentCatalog.map((x) => ({ value: x.code, label: x.label }));
  }, []);


  return (
    <Stack gap="md" p="md" className={classes.applyPage}>
      <Title order={2}>Choose employment type</Title>
      <Select
        placeholder="Select type"
        // uses the catalog-driven options.
        data={selectData}
        //makes it a controlled component.
        value={type}
        onChange={(v) => setType(v || "")}
        clearable
      />


      {!type && (
        <Paper p="md" withBorder>
          Select your employment type to see the relevant application.
        </Paper>
      )}

      {ViewComponent && <ViewComponent employmentCode={type} />}
    </Stack>
  );
}
