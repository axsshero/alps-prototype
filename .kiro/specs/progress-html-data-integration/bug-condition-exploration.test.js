/**
 * Bug Condition Exploration Test for Progress.html Data Integration
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10**
 * 
 * This test uses property-based testing to surface counterexamples that demonstrate:
 * - Progress.html does NOT load data.jsx as a script dependency
 * - Progress.html uses hardcoded local data constants instead of shared data
 * - Progress.html cannot switch projects (hardcoded to ALPS-218)
 * - Data divergence: changes to data.jsx don't appear in Progress.html
 * - Cycle ID mismatch: Progress.html uses "S11", "S12" instead of "sprint-1", "sprint-2"
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Bug Condition Exploration: Progress.html Data Integration', () => {
  let progressHtmlContent;
  let dataJsxContent;
  let progressHtmlDom;

  beforeAll(() => {
    // Read the unfixed Progress.html file
    const progressHtmlPath = path.join(__dirname, '../../../project/Progress.html');
    progressHtmlContent = fs.readFileSync(progressHtmlPath, 'utf-8');
    
    // Read data.jsx to understand the shared data structure
    const dataJsxPath = path.join(__dirname, '../../../project/data.jsx');
    dataJsxContent = fs.readFileSync(dataJsxPath, 'utf-8');
    
    // Parse Progress.html with JSDOM
    progressHtmlDom = new JSDOM(progressHtmlContent);
  });

  describe('Property 1: Bug Condition - Data Isolation', () => {
    
    test('EXPECTED TO FAIL: Progress.html should have <script src="data.jsx"> tag', () => {
      // This test WILL FAIL on unfixed code because the script tag doesn't exist
      const document = progressHtmlDom.window.document;
      const scripts = Array.from(document.querySelectorAll('script'));
      
      const hasDataJsxScript = scripts.some(script => {
        const src = script.getAttribute('src');
        return src && src.includes('data.jsx');
      });
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: No script tag with src="data.jsx" exists
      expect(hasDataJsxScript).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html should NOT define local PEOPLE constant', () => {
      // This test WILL FAIL on unfixed code because local PEOPLE is defined
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      const hasLocalPeople = /const\s+PEOPLE\s*=\s*\{/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: Progress.html defines "const PEOPLE = { rina: {...}, maya: {...}, ... }"
      expect(hasLocalPeople).toBe(false);
    });

    test('EXPECTED TO FAIL: Progress.html should NOT define local CYCLES constant', () => {
      // This test WILL FAIL on unfixed code because local CYCLES is defined
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      const hasLocalCycles = /const\s+CYCLES\s*=\s*\[/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: Progress.html defines "const CYCLES = [ { id: "S11", ... }, ... ]"
      expect(hasLocalCycles).toBe(false);
    });

    test('EXPECTED TO FAIL: Progress.html should NOT define local TICKETS constant', () => {
      // This test WILL FAIL on unfixed code because local TICKETS is defined
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      const hasLocalTickets = /const\s+TICKETS\s*=\s*\[/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: Progress.html defines "const TICKETS = [ { id: "LIN-201", ... }, ... ]"
      expect(hasLocalTickets).toBe(false);
    });

    test('EXPECTED TO FAIL: Progress.html CYCLES should use sprint IDs from data.jsx, not "S11", "S12"', () => {
      // This test WILL FAIL on unfixed code because Progress.html uses different cycle IDs
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if Progress.html uses "S11", "S12", "S13", "S14" cycle IDs
      const usesOldCycleIds = /id:\s*"S11"/.test(scriptContent) || 
                              /id:\s*"S12"/.test(scriptContent) ||
                              /id:\s*"S13"/.test(scriptContent) ||
                              /id:\s*"S14"/.test(scriptContent);
      
      // Check if data.jsx uses "sprint-1", "sprint-2", etc.
      const dataUsesSprintIds = /id:\s*"sprint-\d+"/.test(dataJsxContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: Progress.html uses "S11", "S12", "S13", "S14" while data.jsx uses "sprint-1", "sprint-2", etc.
      expect(usesOldCycleIds).toBe(false);
      expect(dataUsesSprintIds).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html should have projectId parameter handling', () => {
      // This test WILL FAIL on unfixed code because no projectId handling exists
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check for URL parameter reading
      const hasUrlParamHandling = /URLSearchParams/.test(scriptContent) && 
                                   /projectId/.test(scriptContent);
      
      // Check for localStorage fallback
      const hasLocalStorageFallback = /localStorage\.getItem/.test(scriptContent) &&
                                      /projectId/.test(scriptContent);
      
      // EXPECTED: These assertions will FAIL on unfixed code
      // COUNTEREXAMPLE: No URLSearchParams or localStorage.getItem for projectId exists
      expect(hasUrlParamHandling || hasLocalStorageFallback).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html PROJECT should be dynamic, not hardcoded to ALPS-218', () => {
      // This test WILL FAIL on unfixed code because PROJECT.id is hardcoded
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if PROJECT.id is hardcoded to "ALPS-218"
      const hasHardcodedProject = /const\s+PROJECT\s*=\s*\{[\s\S]*?id:\s*"ALPS-218"/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: Progress.html hardcodes "const PROJECT = { id: "ALPS-218", ... }"
      expect(hasHardcodedProject).toBe(false);
    });

    test('EXPECTED TO FAIL: Progress.html should reference window.PEOPLE from data.jsx', () => {
      // This test WILL FAIL on unfixed code because window.PEOPLE is not referenced
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if window.PEOPLE is referenced
      const referencesWindowPeople = /window\.PEOPLE/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: No reference to window.PEOPLE exists
      expect(referencesWindowPeople).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html should reference window.SPRINTS from data.jsx', () => {
      // This test WILL FAIL on unfixed code because window.SPRINTS is not referenced
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if window.SPRINTS is referenced
      const referencesWindowSprints = /window\.SPRINTS/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: No reference to window.SPRINTS exists
      expect(referencesWindowSprints).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html should reference window.LINEAR_TICKETS from data.jsx', () => {
      // This test WILL FAIL on unfixed code because window.LINEAR_TICKETS is not referenced
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if window.LINEAR_TICKETS is referenced
      const referencesWindowLinearTickets = /window\.LINEAR_TICKETS/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: No reference to window.LINEAR_TICKETS exists
      expect(referencesWindowLinearTickets).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html PEOPLE should have extended schema (id, name, fullName, role, initials)', () => {
      // This test WILL FAIL on unfixed code because Progress.html uses simplified PEOPLE schema
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Extract PEOPLE definition from Progress.html
      const peopleMatch = scriptContent.match(/const\s+PEOPLE\s*=\s*\{([\s\S]*?)\};/);
      
      if (peopleMatch) {
        const peopleContent = peopleMatch[1];
        
        // Check if PEOPLE has only fullName and initials (simplified schema)
        const hasOnlySimplifiedSchema = /fullName:/.test(peopleContent) && 
                                        /initials:/.test(peopleContent) &&
                                        !/\bid:/.test(peopleContent) &&
                                        !/\bname:/.test(peopleContent) &&
                                        !/\brole:/.test(peopleContent);
        
        // EXPECTED: This assertion will FAIL on unfixed code
        // COUNTEREXAMPLE: Progress.html PEOPLE only has { fullName, initials }, missing { id, name, role }
        expect(hasOnlySimplifiedSchema).toBe(false);
      }
    });

    test('EXPECTED TO FAIL: Progress.html should have 17+ tickets matching data.jsx LINEAR_TICKETS count', () => {
      // This test WILL FAIL on unfixed code if ticket counts diverge
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Count tickets in Progress.html
      const ticketsMatch = scriptContent.match(/const\s+TICKETS\s*=\s*\[([\s\S]*?)\];/);
      let progressTicketCount = 0;
      if (ticketsMatch) {
        // Count ticket objects by counting "id:" occurrences
        progressTicketCount = (ticketsMatch[1].match(/\bid:\s*"LIN-\d+"/g) || []).length;
      }
      
      // Count ALPS-218 tickets in data.jsx LINEAR_TICKETS
      const dataTicketsForAlps218 = (dataJsxContent.match(/projectId:\s*"ALPS-218"/g) || []).length;
      
      // EXPECTED: This assertion will FAIL if counts don't match
      // COUNTEREXAMPLE: Progress.html has 17 hardcoded tickets, but data.jsx may have different count
      expect(progressTicketCount).toBe(dataTicketsForAlps218);
    });
  });

  describe('Property 1 (Extended): Data Divergence Scenarios', () => {
    
    test('EXPECTED TO FAIL: Adding a new ticket to data.jsx should appear in Progress.html', () => {
      // This test documents the data divergence problem
      // In the unfixed code, adding a ticket to data.jsx won't appear in Progress.html
      
      // Simulate: Developer adds LIN-218 to data.jsx
      const newTicketInDataJsx = 'LIN-218';
      
      // Check if Progress.html would show this ticket
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      const progressHasNewTicket = scriptContent.includes(newTicketInDataJsx);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: New ticket LIN-218 added to data.jsx doesn't appear in Progress.html
      // (This is a hypothetical test - in reality, LIN-218 doesn't exist yet)
      // The test documents that Progress.html won't automatically pick up new tickets
      expect(progressHasNewTicket).toBe(true);
    });

    test('EXPECTED TO FAIL: Progress.html should filter tickets by projectId parameter', () => {
      // This test WILL FAIL on unfixed code because no filtering by projectId exists
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      
      // Check if there's filtering logic for projectId
      const hasProjectIdFiltering = /filter.*projectId/.test(scriptContent) ||
                                     /projectId\s*===/.test(scriptContent);
      
      // EXPECTED: This assertion will FAIL on unfixed code
      // COUNTEREXAMPLE: No projectId filtering logic exists
      expect(hasProjectIdFiltering).toBe(true);
    });
  });

  describe('Counterexample Documentation', () => {
    
    test('Document all counterexamples found', () => {
      const counterexamples = [];
      
      // Counterexample 1: No data.jsx script tag
      const document = progressHtmlDom.window.document;
      const scripts = Array.from(document.querySelectorAll('script'));
      const hasDataJsxScript = scripts.some(script => {
        const src = script.getAttribute('src');
        return src && src.includes('data.jsx');
      });
      if (!hasDataJsxScript) {
        counterexamples.push('No <script src="data.jsx"> tag found in Progress.html');
      }
      
      // Counterexample 2: Local data constants defined
      const scriptContent = progressHtmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)?.[1] || '';
      if (/const\s+PEOPLE\s*=\s*\{/.test(scriptContent)) {
        counterexamples.push('Progress.html defines local PEOPLE constant instead of using window.PEOPLE');
      }
      if (/const\s+CYCLES\s*=\s*\[/.test(scriptContent)) {
        counterexamples.push('Progress.html defines local CYCLES constant instead of using window.SPRINTS');
      }
      if (/const\s+TICKETS\s*=\s*\[/.test(scriptContent)) {
        counterexamples.push('Progress.html defines local TICKETS constant instead of using window.LINEAR_TICKETS');
      }
      
      // Counterexample 3: Cycle ID mismatch
      if (/id:\s*"S11"/.test(scriptContent)) {
        counterexamples.push('Progress.html uses cycle IDs "S11", "S12", "S13", "S14" instead of sprint IDs from data.jsx');
      }
      
      // Counterexample 4: No projectId handling
      if (!/URLSearchParams/.test(scriptContent) || !/projectId/.test(scriptContent)) {
        counterexamples.push('Progress.html has no URL parameter handling for projectId');
      }
      if (!/localStorage\.getItem/.test(scriptContent) || !/projectId/.test(scriptContent)) {
        counterexamples.push('Progress.html has no localStorage fallback for projectId');
      }
      
      // Counterexample 5: Hardcoded PROJECT
      if (/const\s+PROJECT\s*=\s*\{[\s\S]*?id:\s*"ALPS-218"/.test(scriptContent)) {
        counterexamples.push('Progress.html hardcodes PROJECT.id = "ALPS-218" with no dynamic loading');
      }
      
      // Counterexample 6: No window references
      if (!/window\.PEOPLE/.test(scriptContent)) {
        counterexamples.push('Progress.html does not reference window.PEOPLE');
      }
      if (!/window\.SPRINTS/.test(scriptContent)) {
        counterexamples.push('Progress.html does not reference window.SPRINTS');
      }
      if (!/window\.LINEAR_TICKETS/.test(scriptContent)) {
        counterexamples.push('Progress.html does not reference window.LINEAR_TICKETS');
      }
      
      // Counterexample 7: Simplified PEOPLE schema
      const peopleMatch = scriptContent.match(/const\s+PEOPLE\s*=\s*\{([\s\S]*?)\};/);
      if (peopleMatch) {
        const peopleContent = peopleMatch[1];
        if (!/\bid:/.test(peopleContent) || !/\brole:/.test(peopleContent)) {
          counterexamples.push('Progress.html PEOPLE schema is simplified (missing id, name, role fields)');
        }
      }
      
      // Log all counterexamples
      console.log('\n=== COUNTEREXAMPLES FOUND (Bug Confirmation) ===');
      counterexamples.forEach((example, index) => {
        console.log(`${index + 1}. ${example}`);
      });
      console.log('==============================================\n');
      
      // This test always passes - it's just for documentation
      expect(counterexamples.length).toBeGreaterThan(0);
    });
  });
});
