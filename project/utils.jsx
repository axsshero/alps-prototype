// ============================================================
// Pure utility functions for ALPS — Portfolio & Sprints Screens
// ============================================================

// Helper: clamp a value between min and max
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Helper: parse a date value that may be a Date object or ISO string
function parseDate(value) {
  if (value instanceof Date) return value;
  return new Date(value);
}

// ─── Task 2.1 ─────────────────────────────────────────────────────────────────
// computePortfolioSummary(projects)
// Returns { total, byState: { empty, in_progress, blocked, done } }
// Requirements: 1.5

function computePortfolioSummary(projects) {
  const total = projects.length;
  const byState = projects.reduce((acc, p) => {
    acc[p.state] = (acc[p.state] || 0) + 1;
    return acc;
  }, {});
  // Ensure all states are present (default 0)
  return {
    total,
    byState: {
      empty:       byState.empty       || 0,
      in_progress: byState.in_progress || 0,
      blocked:     byState.blocked     || 0,
      done:        byState.done        || 0,
    },
  };
}

// ─── Task 2.3 ─────────────────────────────────────────────────────────────────
// computeSprintHealth(sprint, today)
// Returns "On Track" | "At Risk" | "Overloaded"
// Requirements: 3.5, 3.6

function computeSprintHealth(sprint, today) {
  // Early returns for terminal/not-started statuses
  if (sprint.status === "completed") return "On Track";
  if (sprint.status === "planned")   return "On Track";

  const startDate = new Date(sprint.startDate);
  const endDate   = new Date(sprint.endDate);

  // Guard invalid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "On Track";

  const todayMs  = parseDate(today).getTime();
  const totalMs  = endDate.getTime() - startDate.getTime();

  let elapsedPct;
  if (totalMs === 0) {
    elapsedPct = 0;
  } else {
    elapsedPct = clamp((todayMs - startDate.getTime()) / totalMs, 0, 1) * 100;
  }

  const actualPct = sprint.totalTickets === 0
    ? 0
    : (sprint.completedTickets / sprint.totalTickets) * 100;

  // Count blocked tickets for this sprint using the new filter pattern
  const blockedCount = Object.values(window.LINEAR_TICKETS || {}).filter(
    t => t.sprintId === sprint.id && t.status === "blocked"
  ).length;

  const gap = elapsedPct - actualPct;

  if (blockedCount > 0 || gap >= 20) return "Overloaded";
  if (gap > 0 && gap < 20)           return "At Risk";
  return "On Track";
}

// ─── Task 2.5 ─────────────────────────────────────────────────────────────────
// computeTimelinePosition(sprint, cycle)
// Returns { left: number, width: number } as percentages 0–100
// Requirements: 5.2, 5.5

function computeTimelinePosition(sprint, cycle) {
  const sprintStartRaw = new Date(sprint.startDate);
  const sprintEndRaw   = new Date(sprint.endDate);
  const cycleStart     = new Date(cycle.startDate);
  const cycleEnd       = new Date(cycle.endDate);

  // Guard invalid dates
  if (
    isNaN(sprintStartRaw.getTime()) ||
    isNaN(sprintEndRaw.getTime())   ||
    isNaN(cycleStart.getTime())     ||
    isNaN(cycleEnd.getTime())
  ) {
    return { left: 0, width: 0 };
  }

  const cycleMs = cycleEnd.getTime() - cycleStart.getTime();
  if (cycleMs === 0) return { left: 0, width: 0 };

  // Clamp sprint start/end to cycle boundary
  const sprintStart = Math.max(sprintStartRaw.getTime(), cycleStart.getTime());
  const sprintEnd   = Math.min(sprintEndRaw.getTime(),   cycleEnd.getTime());

  if (sprintEnd <= sprintStart) return { left: 0, width: 0 };

  let left  = (sprintStart - cycleStart.getTime()) / cycleMs * 100;
  let width = (sprintEnd   - sprintStart)           / cycleMs * 100;

  // Clamp both to valid range
  left  = Math.max(0, Math.min(100, left));
  width = Math.max(0, Math.min(100 - left, width));

  return { left, width };
}

// ─── Task 2.7 ─────────────────────────────────────────────────────────────────
// computeTodayMarkerPosition(cycle, today)
// Returns a number (0–100) when today is within cycle range; null when outside
// Requirements: 5.3

function computeTodayMarkerPosition(cycle, today) {
  const cycleStart = new Date(cycle.startDate);
  const cycleEnd   = new Date(cycle.endDate);

  // Guard invalid dates
  if (isNaN(cycleStart.getTime()) || isNaN(cycleEnd.getTime())) return null;

  const cycleMs = cycleEnd.getTime() - cycleStart.getTime();
  if (cycleMs === 0) return null;

  // today can be a Date object or ISO string
  const todayMs = parseDate(today).getTime();
  if (isNaN(todayMs)) return null;

  // Return null when today is outside the cycle range
  if (todayMs < cycleStart.getTime() || todayMs > cycleEnd.getTime()) return null;

  return (todayMs - cycleStart.getTime()) / cycleMs * 100;
}

// ─── Task 2.9 ─────────────────────────────────────────────────────────────────
// computeWorkload(sprints, tickets, people)
// Returns Array<{ personId, name, role, count }> sorted descending by count, filtered to count >= 1
// Requirements: 4.1, 4.4, 4.5

function computeWorkload(sprints, tickets, people) {
  // 1. Filter to active (in_progress) sprints only
  const activeSprints = sprints.filter(s => s.status === "in_progress");

  // 2. Collect all tickets from active sprints using the new filter pattern
  const activeSprintIds = new Set(activeSprints.map(s => s.id));
  const activeTickets = Object.values(tickets).filter(t => activeSprintIds.has(t.sprintId));

  // 3 & 4. Count tickets per assignee
  const countMap = {};
  activeTickets.forEach(ticket => {
    const assignee = ticket.assignee;
    if (assignee) {
      countMap[assignee] = (countMap[assignee] || 0) + 1;
    }
  });

  // 5. Map personId → { personId, name, role, count }
  const workload = Object.keys(countMap).map(personId => ({
    personId,
    name:  people[personId]?.name || personId,
    role:  people[personId]?.role || "",
    count: countMap[personId],
  }));

  // 6. Filter to count >= 1 (already guaranteed by construction, but explicit)
  const filtered = workload.filter(entry => entry.count >= 1);

  // 7. Sort descending by count
  filtered.sort((a, b) => b.count - a.count);

  return filtered;
}

// ─── Task 3.1.1 ───────────────────────────────────────────────────────────────
// validateProjectInput(input)
// Returns { isValid: boolean, errors: { [fieldName]: string } }
// Requirements: FR-3, 1.1

function validateProjectInput(input) {
  const errors = {};

  // Validate title: non-empty, 3-100 characters, no leading/trailing whitespace
  if (!input.title) {
    errors.title = "Title is required";
  } else {
    const trimmed = input.title.trim();
    if (trimmed !== input.title) {
      errors.title = "Title cannot have leading or trailing whitespace";
    } else if (trimmed.length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (trimmed.length > 100) {
      errors.title = "Title must be at most 100 characters";
    }
  }

  // Validate summary: non-empty, 10-500 characters
  if (!input.summary) {
    errors.summary = "Summary is required";
  } else if (input.summary.length < 10) {
    errors.summary = "Summary must be at least 10 characters";
  } else if (input.summary.length > 500) {
    errors.summary = "Summary must be at most 500 characters";
  }

  // Validate requestor: must exist as key in window.PEOPLE
  if (!input.requestor) {
    errors.requestor = "Requestor is required";
  } else if (!window.PEOPLE || !window.PEOPLE[input.requestor]) {
    errors.requestor = "Requestor must be a valid person";
  }

  // Validate pm: must exist as key in window.PEOPLE
  if (!input.pm) {
    errors.pm = "Product Manager is required";
  } else if (!window.PEOPLE || !window.PEOPLE[input.pm]) {
    errors.pm = "Product Manager must be a valid person";
  }

  // Validate techLead: must exist as key in window.PEOPLE
  if (!input.techLead) {
    errors.techLead = "Tech Lead is required";
  } else if (!window.PEOPLE || !window.PEOPLE[input.techLead]) {
    errors.techLead = "Tech Lead must be a valid person";
  }

  // Validate targetDelivery: valid ISO date string, must be >= today
  if (!input.targetDelivery) {
    errors.targetDelivery = "Target delivery date is required";
  } else {
    const deliveryDate = new Date(input.targetDelivery);
    if (isNaN(deliveryDate.getTime())) {
      errors.targetDelivery = "Target delivery date must be a valid date";
    } else {
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deliveryDate.setHours(0, 0, 0, 0);
      
      if (deliveryDate < today) {
        errors.targetDelivery = "Target delivery date must be today or in the future";
      }
    }
  }

  // Validate tags: array of strings, max 5 items, each 1-20 characters
  if (input.tags) {
    if (!Array.isArray(input.tags)) {
      errors.tags = "Tags must be an array";
    } else if (input.tags.length > 5) {
      errors.tags = "Tags must have at most 5 items";
    } else {
      for (let i = 0; i < input.tags.length; i++) {
        const tag = input.tags[i];
        if (typeof tag !== "string") {
          errors.tags = "Each tag must be a string";
          break;
        }
        if (tag.length < 1) {
          errors.tags = "Each tag must be at least 1 character";
          break;
        }
        if (tag.length > 20) {
          errors.tags = "Each tag must be at most 20 characters";
          break;
        }
      }
    }
  }

  // Validate dependencies: array of strings, max 10 items, each 1-100 characters
  if (input.dependencies) {
    if (!Array.isArray(input.dependencies)) {
      errors.dependencies = "Dependencies must be an array";
    } else if (input.dependencies.length > 10) {
      errors.dependencies = "Dependencies must have at most 10 items";
    } else {
      for (let i = 0; i < input.dependencies.length; i++) {
        const dep = input.dependencies[i];
        if (typeof dep !== "string") {
          errors.dependencies = "Each dependency must be a string";
          break;
        }
        if (dep.length < 1) {
          errors.dependencies = "Each dependency must be at least 1 character";
          break;
        }
        if (dep.length > 100) {
          errors.dependencies = "Each dependency must be at most 100 characters";
          break;
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Task 3.1.2 ───────────────────────────────────────────────────────────────
// validateSprintInput(input)
// Returns { isValid: boolean, errors: { [fieldName]: string } }
// Requirements: FR-3, 2.1

function validateSprintInput(input) {
  const errors = {};

  // Validate name: non-empty, 3-50 characters, no leading/trailing whitespace
  if (!input.name) {
    errors.name = "Sprint name is required";
  } else {
    const trimmed = input.name.trim();
    if (trimmed !== input.name) {
      errors.name = "Sprint name cannot have leading or trailing whitespace";
    } else if (trimmed.length < 3) {
      errors.name = "Sprint name must be at least 3 characters";
    } else if (trimmed.length > 50) {
      errors.name = "Sprint name must be at most 50 characters";
    }
  }

  // Validate description: optional, if provided: 0-300 characters
  if (input.description) {
    if (typeof input.description !== "string") {
      errors.description = "Description must be a string";
    } else if (input.description.length > 300) {
      errors.description = "Description must be at most 300 characters";
    }
  }

  // Validate projectId: must exist in window.PROJECTS
  if (!input.projectId) {
    errors.projectId = "Project ID is required";
  } else if (!window.PROJECTS || !window.PROJECTS.find(p => p.id === input.projectId)) {
    errors.projectId = "Project must exist";
  }

  // Validate cycle: non-empty, 1-30 characters (e.g., "Q2 2026")
  if (!input.cycle) {
    errors.cycle = "Cycle is required";
  } else if (typeof input.cycle !== "string") {
    errors.cycle = "Cycle must be a string";
  } else if (input.cycle.length < 1) {
    errors.cycle = "Cycle must be at least 1 character";
  } else if (input.cycle.length > 30) {
    errors.cycle = "Cycle must be at most 30 characters";
  }

  // Validate startDate: valid ISO date string
  if (!input.startDate) {
    errors.startDate = "Start date is required";
  } else {
    const startDate = new Date(input.startDate);
    if (isNaN(startDate.getTime())) {
      errors.startDate = "Start date must be a valid date";
    }
  }

  // Validate endDate: valid ISO date string, must be > startDate
  if (!input.endDate) {
    errors.endDate = "End date is required";
  } else {
    const endDate = new Date(input.endDate);
    if (isNaN(endDate.getTime())) {
      errors.endDate = "End date must be a valid date";
    } else if (input.startDate) {
      const startDate = new Date(input.startDate);
      if (!isNaN(startDate.getTime())) {
        if (endDate <= startDate) {
          errors.endDate = "End date must be after start date";
        } else {
          // Validate date range: endDate - startDate must be 1-90 days
          const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff < 1) {
            errors.endDate = "Sprint duration must be at least 1 day";
          } else if (daysDiff > 90) {
            errors.endDate = "Sprint duration must be at most 90 days";
          }
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Task 3.1.3 ───────────────────────────────────────────────────────────────
// createProject(input)
// Returns { success: boolean, projectId?: string, error?: string }
// Requirements: FR-1, FR-6, 1.1

function createProject(input) {
  // Step 1: Validate input
  const validation = validateProjectInput(input);
  if (!validation.isValid) {
    return { success: false, error: "Validation failed" };
  }

  // Step 2: Ensure window.PROJECTS exists
  if (!window.PROJECTS || !Array.isArray(window.PROJECTS)) {
    return { success: false, error: "Projects array not initialized" };
  }

  // Step 3: Generate unique project ID
  // Find the maximum project number from existing projects
  let maxNumber = 0;
  window.PROJECTS.forEach(project => {
    const match = project.id.match(/^ALPS-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  const nextNumber = maxNumber + 1;
  const projectId = `ALPS-${nextNumber}`;

  // Step 4: Get today's date in ISO format
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // Step 5: Initialize gate structure
  const gates = {
    business: { status: "locked", completeness: 0, checklist: [] },
    product: { status: "locked", completeness: 0, checklist: [] },
    tech: { status: "locked", completeness: 0, checklist: [] },
  };

  // Step 6: Create project object
  const newProject = {
    id: projectId,
    title: input.title,
    summary: input.summary,
    requestor: input.requestor,
    pm: input.pm,
    techLead: input.techLead,
    submitted: todayISO,
    targetDelivery: input.targetDelivery,
    state: "empty",
    currentGate: 1,
    gates: gates,
    blockers: 0,
    dependencies: input.dependencies || [],
    tags: input.tags || [],
    changeLog: [
      {
        gate: "business",
        date: todayISO,
        action: "created",
        by: "system",
        note: "Request created",
      },
    ],
    ticketIds: [],
    sprintIds: [],
    completedTickets: 0,
    totalTickets: 0,
  };

  // Step 7: Add to projects array
  window.PROJECTS.push(newProject);

  // Step 8: Return success
  return { success: true, projectId: projectId };
}

// ─── Task 3.1.4 ───────────────────────────────────────────────────────────────
// createSprint(input)
// Returns { success: boolean, sprintId?: string, error?: string }
// Requirements: FR-2, FR-6, 2.1

function createSprint(input) {
  // Step 1: Validate input
  const validation = validateSprintInput(input);
  if (!validation.isValid) {
    return { success: false, error: "Validation failed" };
  }

  // Step 2: Ensure window.SPRINTS exists
  if (!window.SPRINTS || !Array.isArray(window.SPRINTS)) {
    return { success: false, error: "Sprints array not initialized" };
  }

  // Step 3: Find parent project
  if (!window.PROJECTS || !Array.isArray(window.PROJECTS)) {
    return { success: false, error: "Projects array not initialized" };
  }

  const project = window.PROJECTS.find(p => p.id === input.projectId);
  if (!project) {
    return { success: false, error: "Project not found" };
  }

  // Step 4: Generate unique sprint ID using timestamp
  const sprintId = `sprint-${Date.now()}`;

  // Step 5: Create sprint object
  const newSprint = {
    id: sprintId,
    name: input.name,
    description: input.description || "",
    cycle: input.cycle,
    projectId: input.projectId,
    status: "planned",
    startDate: input.startDate,
    endDate: input.endDate,
    completedTickets: 0,
    totalTickets: 0,
  };

  // Step 6: Add to sprints array
  window.SPRINTS.push(newSprint);

  // Step 7: Update project's sprintIds array
  if (!Array.isArray(project.sprintIds)) {
    project.sprintIds = [];
  }
  project.sprintIds.push(sprintId);

  // Step 8: Return success
  return { success: true, sprintId: sprintId };
}

// ─── Task 3.1.5 ───────────────────────────────────────────────────────────────
// useFormState(initialValues)
// Returns form state object with methods for managing form state
// Requirements: FR-4, 1.2

function useFormState(initialValues) {
  // Initialize state for values, touched fields, errors, submission state
  const [values, setValues] = React.useState(initialValues);
  const [touched, setTouched] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  // setFieldValue: update a field value and clear its error
  const setFieldValue = React.useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field when it's updated
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // setFieldTouched: mark a field as touched (shows validation errors)
  const setFieldTouched = React.useCallback((fieldName, isTouched) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched,
    }));
  }, []);

  // setSubmitting: update submission state
  const setSubmittingState = React.useCallback((isSubmittingValue) => {
    setIsSubmitting(isSubmittingValue);
  }, []);

  // setSubmitError: update overall form submission error
  const setSubmitErrorState = React.useCallback((error) => {
    setSubmitError(error);
  }, []);

  // resetForm: reset all state to initial values
  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
    setIsSubmitting(false);
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    touched,
    errors,
    isSubmitting,
    submitError,
    setFieldValue,
    setFieldTouched,
    setSubmitting: setSubmittingState,
    setSubmitError: setSubmitErrorState,
    resetForm,
  };
}

// ─── Expose on window ─────────────────────────────────────────────────────────

Object.assign(window, {
  computePortfolioSummary,
  computeSprintHealth,
  computeTimelinePosition,
  computeTodayMarkerPosition,
  computeWorkload,
  validateProjectInput,
  validateSprintInput,
  createProject,
  createSprint,
  useFormState,
});
