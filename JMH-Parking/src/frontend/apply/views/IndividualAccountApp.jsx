import classes from "../styles/apply.module.css";
import { useEffect, useMemo } from "react";
import { useForm } from "@mantine/form";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  TextInput,
  Select,
  Divider,
  FileInput,
  List,
  Badge,
} from "@mantine/core";

import {
  SHIFTS,
  isShiftlessEmployment,
  getEligibleFacilities,
  facilitiesToSelectData,
  requiresNightProof,
} from "../data/policies";
import { getRate } from "../data/rates";

export default function IndividualAccountApp({ employmentCode }) {
  const form = useForm({
    initialValues: {
      // personal
      firstName: "",
      lastName: "",
      phone: "",
      email: "",

      // vehicle
      vehicleMake: "",
      vehicleModel: "",
      vehicleColor: "",
      licensePlate: "",

      // address
      address1: "",
      apt: "",
      city: "",
      state: "",
      zip: "",

      // ids
      badgeNumber: "",
      cardNumber: "",
      lawsonNumber: "",

      // policy-driven
      shift: "",
      facility: "",
      rate: "",
      nightProof: null,
    },
    validate: {
      firstName: (v) => (!v?.trim() ? "First name is required" : null),
      lastName: (v) => (!v?.trim() ? "Last name is required" : null),
      phone: (v) => (!v?.trim() ? "Phone number is required" : null),
      email: (v) =>
        !v?.trim()
          ? "Email is required"
          : /^\S+@\S+\.\S+$/.test(v)
          ? null
          : "Enter a valid email",

      licensePlate: (v) => (!v?.trim() ? "License plate is required" : null),
      badgeNumber: (v) => (!v?.trim() ? "Badge # is required" : null),
      // Add picture to indicate exactly which number is being requested
      cardNumber: (v) => (!v?.trim() ? "Card # is required" : null),

      shift: (v) => {
        if (isShiftlessEmployment(employmentCode)) return null;
        return v ? null : "Shift is required";
      },

      facility: (v, values) => {
        if (!v) return "Facility is required";
        const eligible = getEligibleFacilities(employmentCode, values.shift);
        return eligible.includes(v)
          ? null
          : "Facility not allowed for this employment type/shift";
      },

      nightProof: (file, values) => {
        const must = requiresNightProof(employmentCode, values.shift);
        if (!must) return null;
        return file ? null : "Night shift proof is required";
      },
    },
  });

  const shiftless = isShiftlessEmployment(employmentCode);

  const eligibleFacilities = useMemo(
    () => getEligibleFacilities(employmentCode, form.values.shift),
    [employmentCode, form.values.shift]
  );

  const facilityData = useMemo(
    () => facilitiesToSelectData(eligibleFacilities),
    [eligibleFacilities]
  );

  const mustUpload = requiresNightProof(employmentCode, form.values.shift);

  // Auto-fill rate
  useEffect(() => {
    const r = getRate(employmentCode, form.values.shift);
    form.setFieldValue("rate", r == null ? "" : String(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentCode, form.values.shift]);

  // Reset shift + proof for shiftless roles
  useEffect(() => {
    if (shiftless) {
      if (form.values.shift) form.setFieldValue("shift", "");
      if (form.values.nightProof) form.setFieldValue("nightProof", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftless, employmentCode]);

  // Clear proof if not night
  useEffect(() => {
    if (form.values.shift !== SHIFTS.NIGHT && form.values.nightProof) {
      form.setFieldValue("nightProof", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.shift]);

  // Clear facility if it becomes invalid
  useEffect(() => {
    const cur = form.values.facility;
    if (cur && !eligibleFacilities.includes(cur)) {
      form.setFieldValue("facility", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibleFacilities]);

  const onSubmit = form.onSubmit((values) => {
    // Placeholder: submission will come later (FormData when file uploads are real)
    console.log("Payroll application payload (preview):", {
      employmentCode,
      ...values,
    });
  });

  return (
    <Stack gap="md" className={classes.applyView}>
      <Paper
        withBorder
        radius="md"
        p="lg"
        style={{
          borderColor: "rgba(13, 71, 161, 0.35)", // dark-blue tint
          background: "rgba(13, 71, 161, 0.04)",
        }}
      >
        <Group justify="space-between" align="center">
          <div>
            <Title order={3} style={{ color: "#0D47A1" }}>
              Payroll Parking Application
            </Title>
            <Text c="dimmed" size="sm">
              Employment code: <strong>{employmentCode}</strong>
            </Text>
          </div>
          <Badge
            variant="light"
            size="lg"
            style={{ background: "rgba(13, 71, 161, 0.12)", color: "#0D47A1" }}
          >
            Individual Monthly Account
          </Badge>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="lg">
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            {/* Personal */}
            <div>
              <Title order={5} style={{ color: "#0D47A1" }}>
                Personal Information
              </Title>
              <Divider my="sm" />
              <Group grow>
                <TextInput
                  label="First name"
                  placeholder="Jane"
                  {...form.getInputProps("firstName")}
                />
                <TextInput
                  label="Last name"
                  placeholder="Doe"
                  {...form.getInputProps("lastName")}
                />
              </Group>
              <Group grow mt="sm">
                <TextInput
                  label="Phone"
                  placeholder="(305) 555-1234"
                  {...form.getInputProps("phone")}
                />
                <TextInput
                  label="Email"
                  placeholder="jane.doe@email.com"
                  {...form.getInputProps("email")}
                />
              </Group>
            </div>

            {/* Vehicle */}
            <div>
              <Title order={5} style={{ color: "#0D47A1" }}>
                Vehicle Information
              </Title>
              <Divider my="sm" />
              <Group grow>
                <TextInput
                  label="Make"
                  placeholder="Toyota"
                  {...form.getInputProps("vehicleMake")}
                />
                <TextInput
                  label="Model"
                  placeholder="Camry"
                  {...form.getInputProps("vehicleModel")}
                />
              </Group>
              <Group grow mt="sm">
                <TextInput
                  label="Color"
                  placeholder="Blue"
                  {...form.getInputProps("vehicleColor")}
                />
                <TextInput
                  label="License plate #"
                  placeholder="ABC1234"
                  {...form.getInputProps("licensePlate")}
                />
              </Group>
            </div>

            {/* Address */}
            <div>
              <Title order={5} style={{ color: "#0D47A1" }}>
                Billing Address
              </Title>
              <Divider my="sm" />
              <TextInput
                label="Address"
                placeholder="123 Main St"
                {...form.getInputProps("address1")}
              />
              <Group grow mt="sm">
                <TextInput
                  label="Apt / Unit"
                  placeholder="Apt 4B"
                  {...form.getInputProps("apt")}
                />
                <TextInput
                  label="City"
                  placeholder="Miami"
                  {...form.getInputProps("city")}
                />
              </Group>
              <Group grow mt="sm">
                <TextInput
                  label="State"
                  placeholder="FL"
                  {...form.getInputProps("state")}
                />
                <TextInput
                  label="ZIP"
                  placeholder="33136"
                  {...form.getInputProps("zip")}
                />
              </Group>
            </div>

            {/* IDs + Facility/Shift */}
            <div>
              <Title order={5} style={{ color: "#0D47A1" }}>
                Parking Setup
              </Title>
              <Divider my="sm" />

              <Group grow>
                <TextInput
                  label="Badge #"
                  placeholder="123456"
                  {...form.getInputProps("badgeNumber")}
                />
                <TextInput
                  label="Parking card #"
                  placeholder="0001234567"
                  {...form.getInputProps("cardNumber")}
                />
              </Group>

                  {!shiftless && (
                    <Group grow mt="sm">
                      <Select
                        label="Shift"
                        placeholder="Select shift"
                        data={[
                          { value: SHIFTS.DAY, label: "Day" },
                          { value: SHIFTS.NIGHT, label: "Night" },
                        ]}
                        clearable
                        {...form.getInputProps("shift")}
                      />
    
                      <Select
                        label="Facility"
                        placeholder="Select shift first"
                        data={facilityData}
                        disabled={!form.values.shift}
                        clearable
                        {...form.getInputProps("facility")}
                      />
                    </Group>
                  )}
              <Group grow mt="sm">
                <TextInput
                  label="Lawson # (optional)"
                  placeholder="Optional"
                  {...form.getInputProps("lawsonNumber")}
                />
                <TextInput
                  label="Employee rate"
                  placeholder={
                    shiftless
                      ? "N/A"
                      : "Generated from employment type + shift"
                  }
                  readOnly
                  value={form.values.rate ? `$${form.values.rate}` : "$ __"}
                />
              </Group>


              {shiftless && (
                <Select
                  mt="sm"
                  label="Facility"
                  placeholder="Select facility"
                  data={facilityData}
                  clearable
                  {...form.getInputProps("facility")}
                />
              )}

              {mustUpload && (
                <FileInput
                  mt="sm"
                  label="Night shift proof (offer letter)"
                  placeholder="Upload PDF or image"
                  accept="application/pdf,image/*"
                  {...form.getInputProps("nightProof")}
                />
              )}

              <Text c="dimmed" size="sm" mt="xs">
                Facility options are auto-filtered based on employment type and
                shift. Night shift requires proof upload.
              </Text>
            </div>

            {/* Policy text */}
            <div>
              <Title order={5} style={{ color: "#0D47A1" }}>
                Authorization & Policies
              </Title>
              <Divider my="sm" />

              <Text size="sm">
                I agree to pay a monthly designated rate of ${form.values.rate} for as long as I have an active account with Parking Services. 
                It is the parker’s responsibility to notify the parking office of any changes in shift time or association with 
                Jackson Memorial Hospital as it could affect the monthly parking rate. I understand that in order to cancel my account, 
                I must complete the cancellation paperwork and deactivate my parking access card.

              </Text>

              <Divider my="sm" />

              <Text size="sm">
                <strong>REFUND POLICY:</strong> Parking access is granted
                exclusively to one facility on the specified ID Badge/Parking
                Card listed below and for the vehicle registered above. Should a
                cardholder fail to use their access card to gain entrance into
                the parking facility, and not come to the Office for a validation
                during normal business hours, no refund will be given for parking
                fees paid. If you change vehicles, you must stop by the Parking
                Services office to register the new vehicle.
              </Text>

              <Divider my="sm" />

              <Text size="sm">
                <strong>NOTE:</strong> If cardholder parks in another location
                other than the one assigned to them, they will be responsible to
                pay the daily rate. By signing this application, I agree to
                abide by all the rules and regulations regarding parking per the
                State, City, and the County, including Public Health Trust.
              </Text>

              <Divider my="sm" />

              <Title order={6} style={{ color: "#0D47A1" }}>
                Parking Reminders
              </Title>
              <List size="sm" spacing="xs" mt="xs">
                <List.Item>
                  After submitting a parking start up, it is the employee’s
                  responsibility to ensure payroll deductions are made and report
                  discrepancies to Parking Services.
                </List.Item>
                <List.Item>
                  To stop payroll deductions and cancel the account, the employee
                  must submit a parking cancellation form. Refunds are not given
                  if cancellation paperwork is not submitted.
                </List.Item>
                <List.Item>
                  Parking access is granted to one facility only. If a cardholder parks in another location other
                  than the one assigned, the cardholder will be responsible to pay for parking at the daily rate
                  of $11.
                </List.Item>
                <List.Item>
                  Parking access is granted to an individual and may not be
                  shared with another person, including permitting more than one vehicle to park with same parking access
                  card. Any employee who violates this rule will forfeit his/her right to discounted parking privileges
                  and may lose parking access card privileges permanently.
                </List.Item>
                <List.Item>
                  Should a parking cardholder fail to use their parking access card to gain entrance into the parking facility
                  and does not come to the Parking Services Office for a validation during normal business hours, no refund 
                  will be given for any parking fees paid.
                </List.Item>
              </List>

              <Divider my="sm" />

              <Text size="sm" c="dimmed">
                <strong>Processing timeline reminder:</strong> Deductions start
                by pay periods (e.g., paperwork processed 12/12–12/25 may appear
                on the 01/09 paycheck). Please remind Parking Services to cancel
                if you will be absent or need to stop deductions.
              </Text>
            </div>

            {/* Submit placeholder */}
            <Group justify="flex-end">
              <button
                type="submit"
                style={{
                  background: "#0D47A1",
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                Submit (Preview)
              </button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}