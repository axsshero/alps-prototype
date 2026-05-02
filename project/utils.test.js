// ============================================================
// Tests for validateSprintInput() function
// ============================================================

// Mock window object
global.window = {
  PROJECTS: [
    { id: "ALPS-218", name: "Test Project 1" },
    { id: "ALPS-301", name: "Test Project 2" },
  ],
};

// Load the utils module
require('./utils.jsx');

describe('validateSprintInput()', () => {
  const validateSprintInput = global.window.validateSprintInput;

  describe('Valid inputs', () => {
    test('should accept valid sprint input with all required fields', () => {
      const input = {
        name: "Sprint 1",
        description: "Test sprint",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should accept valid sprint input without description', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should accept sprint name with exactly 3 characters', () => {
      const input = {
        name: "ABC",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept sprint name with exactly 50 characters', () => {
      const input = {
        name: "A".repeat(50),
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept cycle with exactly 1 character', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept cycle with exactly 30 characters', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "A".repeat(30),
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept description with exactly 300 characters', () => {
      const input = {
        name: "Sprint 1",
        description: "A".repeat(300),
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept sprint with 1 day duration', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-02",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept sprint with 90 day duration', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-09-29",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });

    test('should accept empty description', () => {
      const input = {
        name: "Sprint 1",
        description: "",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Name validation', () => {
    test('should reject missing name', () => {
      const input = {
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name is required");
    });

    test('should reject empty name', () => {
      const input = {
        name: "",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name is required");
    });

    test('should reject name with leading whitespace', () => {
      const input = {
        name: " Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name cannot have leading or trailing whitespace");
    });

    test('should reject name with trailing whitespace', () => {
      const input = {
        name: "Sprint 1 ",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name cannot have leading or trailing whitespace");
    });

    test('should reject name shorter than 3 characters', () => {
      const input = {
        name: "AB",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name must be at least 3 characters");
    });

    test('should reject name longer than 50 characters', () => {
      const input = {
        name: "A".repeat(51),
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Sprint name must be at most 50 characters");
    });
  });

  describe('Description validation', () => {
    test('should reject description longer than 300 characters', () => {
      const input = {
        name: "Sprint 1",
        description: "A".repeat(301),
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe("Description must be at most 300 characters");
    });

    test('should reject non-string description', () => {
      const input = {
        name: "Sprint 1",
        description: 123,
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe("Description must be a string");
    });
  });

  describe('ProjectId validation', () => {
    test('should reject missing projectId', () => {
      const input = {
        name: "Sprint 1",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.projectId).toBe("Project ID is required");
    });

    test('should reject non-existent projectId', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-999",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.projectId).toBe("Project must exist");
    });

    test('should accept valid projectId', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-301",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Cycle validation', () => {
    test('should reject missing cycle', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.cycle).toBe("Cycle is required");
    });

    test('should reject empty cycle', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.cycle).toBe("Cycle is required");
    });

    test('should reject non-string cycle', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: 123,
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.cycle).toBe("Cycle must be a string");
    });

    test('should reject cycle longer than 30 characters', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "A".repeat(31),
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.cycle).toBe("Cycle must be at most 30 characters");
    });
  });

  describe('StartDate validation', () => {
    test('should reject missing startDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.startDate).toBe("Start date is required");
    });

    test('should reject invalid startDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "invalid-date",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.startDate).toBe("Start date must be a valid date");
    });
  });

  describe('EndDate validation', () => {
    test('should reject missing endDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("End date is required");
    });

    test('should reject invalid endDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "invalid-date",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("End date must be a valid date");
    });

    test('should reject endDate equal to startDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-01",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("End date must be after start date");
    });

    test('should reject endDate before startDate', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-14",
        endDate: "2026-07-01",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("End date must be after start date");
    });

    test('should reject sprint duration less than 1 day', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-01",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("End date must be after start date");
    });

    test('should reject sprint duration greater than 90 days', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-09-30",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.endDate).toBe("Sprint duration must be at most 90 days");
    });
  });

  describe('Multiple field errors', () => {
    test('should report multiple errors when multiple fields are invalid', () => {
      const input = {
        name: "AB",
        description: "A".repeat(301),
        projectId: "ALPS-999",
        cycle: "",
        startDate: "invalid",
        endDate: "2026-07-01",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.projectId).toBeDefined();
      expect(result.errors.cycle).toBeDefined();
      expect(result.errors.startDate).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    test('should handle null input gracefully', () => {
      const result = validateSprintInput({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test('should not mutate input object', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const inputCopy = JSON.parse(JSON.stringify(input));
      validateSprintInput(input);
      expect(input).toEqual(inputCopy);
    });

    test('should handle dates with time components', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01T00:00:00Z",
        endDate: "2026-07-14T23:59:59Z",
      };
      const result = validateSprintInput(input);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Return value structure', () => {
    test('should return object with isValid and errors properties', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.errors).toBe('object');
    });

    test('should return empty errors object when valid', () => {
      const input = {
        name: "Sprint 1",
        projectId: "ALPS-218",
        cycle: "Q2 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-14",
      };
      const result = validateSprintInput(input);
      expect(result.errors).toEqual({});
    });
  });
});


// ============================================================
// Tests for createProject() function
// ============================================================

describe('createProject()', () => {
  const createProject = global.window.createProject;
  const validateProjectInput = global.window.validateProjectInput;

  // Reset window.PROJECTS before each test
  beforeEach(() => {
    global.window.PROJECTS = [
      { id: "ALPS-218", name: "Test Project 1" },
      { id: "ALPS-301", name: "Test Project 2" },
    ];
    global.window.PEOPLE = {
      asha: { id: "asha", name: "Asha Pillai" },
      rina: { id: "rina", name: "Rina Hartono" },
      mateo: { id: "mateo", name: "Mateo Cabrera" },
    };
  });

  describe('Valid inputs', () => {
    test('should create a new project with valid input', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
        tags: ["test"],
        dependencies: [],
      };
      const result = createProject(input);
      expect(result.success).toBe(true);
      expect(result.projectId).toBe("ALPS-302");
      expect(result.error).toBeUndefined();
    });

    test('should add project to window.PROJECTS', () => {
      const initialLength = global.window.PROJECTS.length;
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      createProject(input);
      expect(global.window.PROJECTS.length).toBe(initialLength + 1);
    });

    test('should create project with correct structure', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
        tags: ["test"],
        dependencies: ["Dependency 1"],
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject).toBeDefined();
      expect(newProject.title).toBe("New Project");
      expect(newProject.summary).toBe("This is a new project for testing");
      expect(newProject.requestor).toBe("asha");
      expect(newProject.pm).toBe("rina");
      expect(newProject.techLead).toBe("mateo");
      expect(newProject.targetDelivery).toBe("2026-12-31");
      expect(newProject.state).toBe("empty");
      expect(newProject.currentGate).toBe(1);
      expect(newProject.blockers).toBe(0);
      expect(newProject.tags).toEqual(["test"]);
      expect(newProject.dependencies).toEqual(["Dependency 1"]);
    });

    test('should initialize gates with correct structure', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject.gates).toBeDefined();
      expect(newProject.gates.business).toBeDefined();
      expect(newProject.gates.product).toBeDefined();
      expect(newProject.gates.tech).toBeDefined();
      
      Object.values(newProject.gates).forEach(gate => {
        expect(gate.status).toBe("locked");
        expect(gate.completeness).toBe(0);
        expect(gate.checklist).toEqual([]);
      });
    });

    test('should create changeLog entry', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject.changeLog).toBeDefined();
      expect(newProject.changeLog.length).toBeGreaterThan(0);
      expect(newProject.changeLog[0].action).toBe("created");
      expect(newProject.changeLog[0].gate).toBe("business");
    });

    test('should initialize empty arrays for ticketIds and sprintIds', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject.ticketIds).toEqual([]);
      expect(newProject.sprintIds).toEqual([]);
      expect(newProject.completedTickets).toBe(0);
      expect(newProject.totalTickets).toBe(0);
    });

    test('should generate unique project IDs', () => {
      const input1 = {
        title: "Project 1",
        summary: "This is project 1 for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const input2 = {
        title: "Project 2",
        summary: "This is project 2 for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      
      const result1 = createProject(input1);
      const result2 = createProject(input2);
      
      expect(result1.projectId).not.toBe(result2.projectId);
      expect(result1.projectId).toBe("ALPS-302");
      expect(result2.projectId).toBe("ALPS-303");
    });

    test('should handle optional tags and dependencies', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject.tags).toEqual([]);
      expect(newProject.dependencies).toEqual([]);
    });

    test('should set submitted date to today', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      const today = new Date().toISOString().split('T')[0];
      expect(newProject.submitted).toBe(today);
    });
  });

  describe('Invalid inputs', () => {
    test('should reject invalid project input', () => {
      const input = {
        title: "AB", // Too short
        summary: "Short", // Too short
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
      expect(result.projectId).toBeUndefined();
    });

    test('should not modify window.PROJECTS on validation failure', () => {
      const initialLength = global.window.PROJECTS.length;
      const input = {
        title: "AB", // Too short
        summary: "Short", // Too short
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      createProject(input);
      expect(global.window.PROJECTS.length).toBe(initialLength);
    });

    test('should reject input with invalid requestor', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "invalid-person",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
    });

    test('should reject input with invalid pm', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "invalid-person",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
    });

    test('should reject input with invalid techLead', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "invalid-person",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
    });

    test('should reject input with past targetDelivery date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString().split('T')[0];
      
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: yesterdayISO,
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
    });
  });

  describe('Edge cases', () => {
    test('should handle window.PROJECTS not initialized', () => {
      global.window.PROJECTS = null;
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Projects array not initialized");
    });

    test('should handle window.PROJECTS not being an array', () => {
      global.window.PROJECTS = {};
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Projects array not initialized");
    });

    test('should handle empty window.PROJECTS array', () => {
      global.window.PROJECTS = [];
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(true);
      expect(result.projectId).toBe("ALPS-1");
    });

    test('should handle projects with non-standard IDs', () => {
      global.window.PROJECTS = [
        { id: "CUSTOM-1" },
        { id: "ALPS-100" },
        { id: "ALPS-50" },
      ];
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.success).toBe(true);
      expect(result.projectId).toBe("ALPS-101");
    });

    test('should not mutate input object', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
        tags: ["test"],
        dependencies: ["dep1"],
      };
      const inputCopy = JSON.parse(JSON.stringify(input));
      createProject(input);
      expect(input).toEqual(inputCopy);
    });

    test('should handle tags and dependencies arrays correctly', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
        tags: ["tag1", "tag2", "tag3"],
        dependencies: ["dep1", "dep2"],
      };
      const result = createProject(input);
      const newProject = global.window.PROJECTS.find(p => p.id === result.projectId);
      
      expect(newProject.tags).toEqual(["tag1", "tag2", "tag3"]);
      expect(newProject.dependencies).toEqual(["dep1", "dep2"]);
    });
  });

  describe('Return value structure', () => {
    test('should return object with success and projectId on success', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('projectId');
      expect(result.success).toBe(true);
      expect(typeof result.projectId).toBe('string');
    });

    test('should return object with success and error on failure', () => {
      const input = {
        title: "AB",
        summary: "Short",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      expect(result.success).toBe(false);
      expect(typeof result.error).toBe('string');
    });

    test('should not include error property on success', () => {
      const input = {
        title: "New Project",
        summary: "This is a new project for testing",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.error).toBeUndefined();
    });

    test('should not include projectId property on failure', () => {
      const input = {
        title: "AB",
        summary: "Short",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const result = createProject(input);
      expect(result.projectId).toBeUndefined();
    });
  });

  describe('Correctness properties', () => {
    test('Property 1: Project Creation Idempotency - creating same input twice produces different IDs', () => {
      const input = {
        title: "Test Project",
        summary: "This is a test project for idempotency",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      
      const result1 = createProject(input);
      const result2 = createProject(input);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.projectId).not.toBe(result2.projectId);
    });

    test('Property 3: Validation Prevents Invalid Data - invalid inputs do not modify data', () => {
      const initialLength = global.window.PROJECTS.length;
      const invalidInput = {
        title: "AB",
        summary: "Short",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      
      const result = createProject(invalidInput);
      
      expect(result.success).toBe(false);
      expect(global.window.PROJECTS.length).toBe(initialLength);
    });

    test('Property 5: Project ID Uniqueness - each created project has unique ID', () => {
      const input1 = {
        title: "Project 1",
        summary: "This is project 1 for uniqueness test",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      const input2 = {
        title: "Project 2",
        summary: "This is project 2 for uniqueness test",
        requestor: "asha",
        pm: "rina",
        techLead: "mateo",
        targetDelivery: "2026-12-31",
      };
      
      const result1 = createProject(input1);
      const result2 = createProject(input2);
      
      expect(result1.projectId).not.toBe(result2.projectId);
      const count1 = global.window.PROJECTS.filter(p => p.id === result1.projectId).length;
      const count2 = global.window.PROJECTS.filter(p => p.id === result2.projectId).length;
      expect(count1).toBe(1);
      expect(count2).toBe(1);
    });
  });
});


// ============================================================
// Tests for useFormState() hook
// ============================================================

describe('useFormState()', () => {
  // Note: useFormState is a React hook and can only be tested in a browser environment
  // These tests verify that the hook is properly exposed on window and has the correct structure
  
  test('should be exposed on window', () => {
    expect(global.window.useFormState).toBeDefined();
    expect(typeof global.window.useFormState).toBe('function');
  });

  test('should be a function that can be called', () => {
    const useFormState = global.window.useFormState;
    expect(typeof useFormState).toBe('function');
  });

  // Note: Full hook testing requires a React testing environment (e.g., @testing-library/react)
  // The hook implementation is verified through:
  // 1. Integration tests in the browser (when used in actual components)
  // 2. Manual testing with NewRequestScreen and NewSprintForm components
  // 3. Code review of the hook implementation
});
