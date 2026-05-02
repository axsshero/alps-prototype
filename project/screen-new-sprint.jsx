// ============================================================
// NewSprintForm — Create new sprint within a project
// ============================================================

function NewSprintForm({ projectId, onSuccess }) {
  const form = window.useFormState({
    name: "",
    description: "",
    cycle: "",
    startDate: "",
    endDate: "",
  });

  const [submitError, setSubmitError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const successRef = React.useRef(null);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    form.setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    // Create input object with projectId
    const sprintInput = {
      ...form.values,
      projectId: projectId,
    };

    // Validate form
    const validation = window.validateSprintInput(sprintInput);
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      Object.keys(validation.errors).forEach((fieldName) => {
        form.setFieldTouched(fieldName, true);
      });
      form.setSubmitting(false);
      setSubmitError("Please fix the errors below");
      return;
    }

    // Create sprint
    const result = window.createSprint(sprintInput);
    if (result.success) {
      // Show success message
      setSuccessMessage(`Sprint "${form.values.name}" created successfully!`);
      // Reset form and call success callback
      form.resetForm();
      setSubmitError(null);
      // Focus success message for accessibility
      if (successRef.current) {
        successRef.current.focus();
      }
      if (onSuccess) {
        onSuccess(result.sprintId);
      }
    } else {
      setSubmitError(result.error || "Failed to create sprint");
      form.setSubmitting(false);
    }
  }, [form, projectId, onSuccess]);

  const isFormValid = 
    Object.keys(form.errors).length === 0 && 
    form.values.name && 
    form.values.cycle && 
    form.values.startDate && 
    form.values.endDate;

  return (
    <div style={{ maxWidth: "600px" }}>
      <window.Section kicker="Create" title="New Sprint">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* Success message */}
          {successMessage && (
            <div
              ref={successRef}
              tabIndex="-1"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                padding: "12px",
                background: "var(--alps-success-overlay)",
                border: "1px solid var(--alps-success)",
                borderRadius: "4px",
                color: "var(--alps-success)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {window.Icon.check}
              </span>
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{
                padding: "12px",
                background: "var(--alps-danger-overlay)",
                border: "1px solid var(--alps-danger)",
                borderRadius: "4px",
                color: "var(--alps-danger)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {window.Icon.warn}
              </span>
              {submitError}
            </div>
          )}

          {/* Required fields section */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--alps-text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
              Required Information
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <window.FormField
                label="Sprint Name"
                name="name"
                type="text"
                value={form.values.name}
                error={form.errors.name}
                touched={form.touched.name}
                onChange={(e) => form.setFieldValue("name", e.target.value)}
                onBlur={() => form.setFieldTouched("name", true)}
                required
                placeholder="e.g., Sprint 1 — Foundation"
              />

              <window.FormField
                label="Cycle"
                name="cycle"
                type="text"
                value={form.values.cycle}
                error={form.errors.cycle}
                touched={form.touched.cycle}
                onChange={(e) => form.setFieldValue("cycle", e.target.value)}
                onBlur={() => form.setFieldTouched("cycle", true)}
                required
                placeholder="e.g., Q2 2026"
              />

              <window.FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={form.values.startDate}
                error={form.errors.startDate}
                touched={form.touched.startDate}
                onChange={(e) => form.setFieldValue("startDate", e.target.value)}
                onBlur={() => form.setFieldTouched("startDate", true)}
                required
              />

              <window.FormField
                label="End Date"
                name="endDate"
                type="date"
                value={form.values.endDate}
                error={form.errors.endDate}
                touched={form.touched.endDate}
                onChange={(e) => form.setFieldValue("endDate", e.target.value)}
                onBlur={() => form.setFieldTouched("endDate", true)}
                required
              />
            </div>
          </div>

          {/* Optional fields section */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--alps-text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
              Optional Information
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              <window.FormField
                label="Description"
                name="description"
                type="text"
                value={form.values.description}
                error={form.errors.description}
                touched={form.touched.description}
                onChange={(e) => form.setFieldValue("description", e.target.value)}
                onBlur={() => form.setFieldTouched("description", true)}
                placeholder="Describe the sprint goals (optional, max 300 characters)"
              />
            </div>
          </div>

          {/* Form actions */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--alps-border)" }}>
            <button
              type="submit"
              disabled={!isFormValid || form.isSubmitting}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: isFormValid && !form.isSubmitting ? "var(--alps-primary)" : "var(--alps-text-muted)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isFormValid && !form.isSubmitting ? "pointer" : "not-allowed",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                opacity: isFormValid && !form.isSubmitting ? 1 : 0.5,
                transition: "opacity 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {form.isSubmitting ? "Creating..." : "Create Sprint"}
            </button>
            <button
              type="button"
              onClick={() => form.resetForm()}
              disabled={form.isSubmitting}
              style={{
                padding: "10px 16px",
                background: "transparent",
                color: form.isSubmitting ? "var(--alps-text-muted)" : "var(--alps-text-muted)",
                border: "1px solid var(--alps-border)",
                borderRadius: "4px",
                cursor: form.isSubmitting ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
                opacity: form.isSubmitting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!form.isSubmitting) {
                  e.currentTarget.style.borderColor = "var(--alps-text)";
                  e.currentTarget.style.color = "var(--alps-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!form.isSubmitting) {
                  e.currentTarget.style.borderColor = "var(--alps-border)";
                  e.currentTarget.style.color = "var(--alps-text-muted)";
                }
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </window.Section>
    </div>
  );
}

Object.assign(window, { NewSprintForm });
