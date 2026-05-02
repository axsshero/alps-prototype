// ============================================================
// NewRequestScreen — Create new project/request
// ============================================================

function NewRequestScreen({ setScreen, setActiveProjectId }) {
  const form = window.useFormState({
    title: "",
    summary: "",
    requestor: "",
    pm: "",
    techLead: "",
    targetDelivery: "",
    tags: [],
    dependencies: [],
  });

  const [tagInput, setTagInput] = React.useState("");
  const [depInput, setDepInput] = React.useState("");
  const [submitError, setSubmitError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const successRef = React.useRef(null);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    form.setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    // Validate form
    const validation = window.validateProjectInput(form.values);
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      Object.keys(validation.errors).forEach((fieldName) => {
        form.setFieldTouched(fieldName, true);
      });
      form.setSubmitting(false);
      setSubmitError("Please fix the errors below");
      return;
    }

    // Create project
    const result = window.createProject(form.values);
    if (result.success) {
      // Show success message
      setSuccessMessage(`Project "${form.values.title}" created successfully! Navigating to dashboard...`);
      // Focus success message for accessibility
      if (successRef.current) {
        successRef.current.focus();
      }
      // Navigate to dashboard with new project
      setTimeout(() => {
        setActiveProjectId(result.projectId);
        setScreen("dashboard");
        form.resetForm();
      }, 500);
    } else {
      setSubmitError(result.error || "Failed to create project");
      form.setSubmitting(false);
    }
  }, [form, setScreen, setActiveProjectId]);

  const handleAddTag = React.useCallback(() => {
    if (tagInput.trim() && form.values.tags.length < 5) {
      const newTags = [...form.values.tags, tagInput.trim()];
      form.setFieldValue("tags", newTags);
      setTagInput("");
    }
  }, [tagInput, form]);

  const handleRemoveTag = React.useCallback((index) => {
    const newTags = form.values.tags.filter((_, i) => i !== index);
    form.setFieldValue("tags", newTags);
  }, [form]);

  const handleAddDependency = React.useCallback(() => {
    if (depInput.trim() && form.values.dependencies.length < 10) {
      const newDeps = [...form.values.dependencies, depInput.trim()];
      form.setFieldValue("dependencies", newDeps);
      setDepInput("");
    }
  }, [depInput, form]);

  const handleRemoveDependency = React.useCallback((index) => {
    const newDeps = form.values.dependencies.filter((_, i) => i !== index);
    form.setFieldValue("dependencies", newDeps);
  }, [form]);

  const isFormValid = Object.keys(form.errors).length === 0 && form.values.title && form.values.summary && form.values.requestor && form.values.pm && form.values.techLead && form.values.targetDelivery;

  return (
    <div style={{ maxWidth: "800px" }}>
      <window.Section kicker="Create" title="New Request">
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
                label="Project Title"
                name="title"
                type="text"
                value={form.values.title}
                error={form.errors.title}
                touched={form.touched.title}
                onChange={(e) => form.setFieldValue("title", e.target.value)}
                onBlur={() => form.setFieldTouched("title", true)}
                required
                placeholder="e.g., Mobile App Redesign"
              />

              <window.FormField
                label="Summary"
                name="summary"
                type="text"
                value={form.values.summary}
                error={form.errors.summary}
                touched={form.touched.summary}
                onChange={(e) => form.setFieldValue("summary", e.target.value)}
                onBlur={() => form.setFieldTouched("summary", true)}
                required
                placeholder="Describe the project in 10-500 characters"
              />

              {/* Requestor dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="requestor"
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--alps-text)",
                    marginBottom: "6px",
                  }}
                >
                  Requestor
                  <span style={{ color: "var(--alps-danger)", marginLeft: "4px" }}>*</span>
                </label>
                <select
                  id="requestor"
                  value={form.values.requestor}
                  onChange={(e) => form.setFieldValue("requestor", e.target.value)}
                  onBlur={() => form.setFieldTouched("requestor", true)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    fontFamily: "var(--font-sans)",
                    border: form.touched.requestor && form.errors.requestor ? "1px solid var(--alps-danger)" : "1px solid var(--alps-border)",
                    borderRadius: "4px",
                    background: "var(--alps-bg)",
                    color: "var(--alps-text)",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                    outline: "none",
                  }}
                >
                  <option value="">Select a requestor...</option>
                  {Object.entries(window.PEOPLE || {}).map(([key, person]) => (
                    <option key={key} value={key}>
                      {person.fullName} — {person.role}
                    </option>
                  ))}
                </select>
                {form.touched.requestor && form.errors.requestor && (
                  <div style={{ fontSize: "12px", color: "var(--alps-danger)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {window.Icon.warn}
                    </span>
                    {form.errors.requestor}
                  </div>
                )}
              </div>

              {/* PM dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="pm"
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--alps-text)",
                    marginBottom: "6px",
                  }}
                >
                  Product Manager
                  <span style={{ color: "var(--alps-danger)", marginLeft: "4px" }}>*</span>
                </label>
                <select
                  id="pm"
                  value={form.values.pm}
                  onChange={(e) => form.setFieldValue("pm", e.target.value)}
                  onBlur={() => form.setFieldTouched("pm", true)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    fontFamily: "var(--font-sans)",
                    border: form.touched.pm && form.errors.pm ? "1px solid var(--alps-danger)" : "1px solid var(--alps-border)",
                    borderRadius: "4px",
                    background: "var(--alps-bg)",
                    color: "var(--alps-text)",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                    outline: "none",
                  }}
                >
                  <option value="">Select a PM...</option>
                  {Object.entries(window.PEOPLE || {}).map(([key, person]) => (
                    <option key={key} value={key}>
                      {person.fullName} — {person.role}
                    </option>
                  ))}
                </select>
                {form.touched.pm && form.errors.pm && (
                  <div style={{ fontSize: "12px", color: "var(--alps-danger)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {window.Icon.warn}
                    </span>
                    {form.errors.pm}
                  </div>
                )}
              </div>

              {/* Tech Lead dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="techLead"
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--alps-text)",
                    marginBottom: "6px",
                  }}
                >
                  Tech Lead
                  <span style={{ color: "var(--alps-danger)", marginLeft: "4px" }}>*</span>
                </label>
                <select
                  id="techLead"
                  value={form.values.techLead}
                  onChange={(e) => form.setFieldValue("techLead", e.target.value)}
                  onBlur={() => form.setFieldTouched("techLead", true)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    fontFamily: "var(--font-sans)",
                    border: form.touched.techLead && form.errors.techLead ? "1px solid var(--alps-danger)" : "1px solid var(--alps-border)",
                    borderRadius: "4px",
                    background: "var(--alps-bg)",
                    color: "var(--alps-text)",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                    outline: "none",
                  }}
                >
                  <option value="">Select a tech lead...</option>
                  {Object.entries(window.PEOPLE || {}).map(([key, person]) => (
                    <option key={key} value={key}>
                      {person.fullName} — {person.role}
                    </option>
                  ))}
                </select>
                {form.touched.techLead && form.errors.techLead && (
                  <div style={{ fontSize: "12px", color: "var(--alps-danger)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {window.Icon.warn}
                    </span>
                    {form.errors.techLead}
                  </div>
                )}
              </div>

              <window.FormField
                label="Target Delivery Date"
                name="targetDelivery"
                type="date"
                value={form.values.targetDelivery}
                error={form.errors.targetDelivery}
                touched={form.touched.targetDelivery}
                onChange={(e) => form.setFieldValue("targetDelivery", e.target.value)}
                onBlur={() => form.setFieldTouched("targetDelivery", true)}
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
              {/* Tags */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--alps-text)",
                    marginBottom: "6px",
                  }}
                >
                  Tags
                  <span style={{ fontSize: "11px", color: "var(--alps-text-muted)", fontWeight: 400, marginLeft: "8px" }}>
                    (max 5)
                  </span>
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    disabled={form.values.tags.length >= 5}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontFamily: "var(--font-sans)",
                      border: "1px solid var(--alps-border)",
                      borderRadius: "4px",
                      background: "var(--alps-bg)",
                      color: "var(--alps-text)",
                      boxSizing: "border-box",
                      outline: "none",
                      opacity: form.values.tags.length >= 5 ? 0.5 : 1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={form.values.tags.length >= 5 || !tagInput.trim()}
                    style={{
                      padding: "8px 12px",
                      background: "var(--alps-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: form.values.tags.length >= 5 || !tagInput.trim() ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      opacity: form.values.tags.length >= 5 || !tagInput.trim() ? 0.5 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    Add
                  </button>
                </div>
                {form.values.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {form.values.tags.map((tag, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 8px",
                          background: "var(--alps-primary-overlay)",
                          border: "1px solid var(--alps-primary)",
                          borderRadius: "3px",
                          fontSize: "12px",
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(i)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--alps-primary)",
                            cursor: "pointer",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {window.Icon.close}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.errors.tags && form.touched.tags && (
                  <div style={{ fontSize: "12px", color: "var(--alps-danger)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {window.Icon.warn}
                    </span>
                    {form.errors.tags}
                  </div>
                )}
              </div>

              {/* Dependencies */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--alps-text)",
                    marginBottom: "6px",
                  }}
                >
                  Dependencies
                  <span style={{ fontSize: "11px", color: "var(--alps-text-muted)", fontWeight: 400, marginLeft: "8px" }}>
                    (max 10)
                  </span>
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={depInput}
                    onChange={(e) => setDepInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDependency();
                      }
                    }}
                    placeholder="Add a dependency..."
                    disabled={form.values.dependencies.length >= 10}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontFamily: "var(--font-sans)",
                      border: "1px solid var(--alps-border)",
                      borderRadius: "4px",
                      background: "var(--alps-bg)",
                      color: "var(--alps-text)",
                      boxSizing: "border-box",
                      outline: "none",
                      opacity: form.values.dependencies.length >= 10 ? 0.5 : 1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDependency}
                    disabled={form.values.dependencies.length >= 10 || !depInput.trim()}
                    style={{
                      padding: "8px 12px",
                      background: "var(--alps-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: form.values.dependencies.length >= 10 || !depInput.trim() ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      opacity: form.values.dependencies.length >= 10 || !depInput.trim() ? 0.5 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    Add
                  </button>
                </div>
                {form.values.dependencies.length > 0 && (
                  <div style={{ display: "grid", gap: "6px" }}>
                    {form.values.dependencies.map((dep, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          background: "var(--alps-bg)",
                          border: "1px solid var(--alps-border)",
                          borderRadius: "3px",
                          fontSize: "12px",
                        }}
                      >
                        <span>{dep}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDependency(i)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--alps-text-muted)",
                            cursor: "pointer",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {window.Icon.close}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.errors.dependencies && form.touched.dependencies && (
                  <div style={{ fontSize: "12px", color: "var(--alps-danger)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {window.Icon.warn}
                    </span>
                    {form.errors.dependencies}
                  </div>
                )}
              </div>
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
              {form.isSubmitting ? "Creating..." : "Create Request"}
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

Object.assign(window, { NewRequestScreen });
