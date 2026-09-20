## Problem Statement

Users need a simple, general-purpose countdown they can project at a venue. They need to set a target clock time, show a readable countdown without configuration controls, and choose what appears when time runs out. Event-specific terminology and preset event messages make the tool less reusable.

Tool Hub currently contains a React and Vite starter screen, with no implemented tools or configured test suite.

## Solution

Provide a static tool homepage with a Countdown Timer card leading to a dedicated tool page. Users enter today's Target Time, an optional title, and an optional Completion Message, then display a large white countdown on a dark background in fullscreen. The countdown uses the projection computer's local time and retains settings in the same browser across reloads.

When the countdown reaches zero, display the user's Completion Message if provided; otherwise retain `00:00:00`. Keep the entire experience silent and use neutral, general-purpose wording.

## User Stories

1. As a user, I want a tool homepage, so that I can find the available tools.
2. As a user, I want a Countdown Timer card leading to a dedicated page, so that I can open the tool easily.
3. As an operator, I want general-purpose labels, so that I can use the timer beyond events.
4. As an operator, I want to specify a Target Time today, so that the countdown ends at a scheduled clock time.
5. As an operator, I want the timer to use my computer's local time, so that the target matches the clock used at the venue.
6. As an operator, I want invalid or already-passed Target Times rejected when configuring the timer, so that I do not start an unintended countdown.
7. As an operator, I want an optional title, so that I can explain the countdown's purpose when needed.
8. As an operator, I want the title blank by default and hidden when empty, so that the display can contain only the countdown.
9. As an audience member, I want large white digits on a dark background, so that I can read the projected countdown.
10. As an audience member, I want a fixed `HH:MM:SS` display, so that hours, minutes, and seconds are unambiguous.
11. As an operator, I want a fullscreen control, so that the timer can fill the projection screen.
12. As an operator, I want settings hidden while projecting, so that the audience sees a focused display.
13. As an operator, I want to exit fullscreen with `Esc` and see settings again, so that I can adjust the timer.
14. As an operator, I want mouse movement to temporarily reveal a return-to-settings control, so that I can return without remembering a shortcut.
15. As an operator, I want the countdown to continue while I view settings, so that editing does not interrupt timekeeping.
16. As an operator, I want an edited Target Time to take effect only when reapplied, so that incomplete edits do not change the running countdown.
17. As an operator, I want to enter my own Completion Message, so that the finished display suits my purpose.
18. As an operator, I want the Completion Message blank by default, so that the tool does not assume an event-specific message.
19. As an audience member, I want the countdown replaced by the configured Completion Message at zero, so that I can see the intended completion notice.
20. As an operator, I want the timer to remain at `00:00:00` when no Completion Message is entered, so that a message is not required.
21. As an operator, I want completion to remain silent, so that the timer does not interfere with venue audio.
22. As an operator, I want my title, Target Time, and Completion Message retained in the same browser, so that a reload does not erase setup.
23. As an operator, I want reloading to recalculate the remaining time against the original dated Target Time, so that the countdown does not restart or shift to another day.
24. As an operator, I want a restored timer whose Target Time has passed to show its completion state, so that reloading does not create a new countdown.

## Implementation Decisions

- Build on the existing React, TypeScript, and Vite application. Deliver a static website; the feature needs no backend or account system.
- Replace the starter experience with a tool homepage and a dedicated Countdown Timer page. Keep navigation suitable for additional tools without implementing other tools in this scope.
- Use the glossary terms Countdown Timer, Target Time, and Completion Message. Use a neutral title field rather than an event-name field.
- Support a target clock time on the current local calendar day only. Validate the configured Target Time before applying it; do not silently roll a past time over to tomorrow.
- Store the applied Target Time with its original date. Derive remaining time from the current clock and that target rather than treating interval callbacks as elapsed time. Clamp the display at zero.
- Show two-digit hours, minutes, and seconds in a fixed `HH:MM:SS` layout.
- Keep the title and Completion Message optional and blank by default. Hide a blank title. Display the entered Completion Message at zero or retain `00:00:00` if it is blank. Do not insert event-specific fallback text.
- Separate editing settings from the applied countdown. Returning to settings does not pause the countdown; an edited Target Time replaces the running target only when reapplied.
- Provide a fullscreen projection presentation with settings hidden. Respond to native fullscreen exit, including `Esc`, by revealing settings. Mouse movement while projecting temporarily reveals a return-to-settings control.
- Retain settings using browser-local persistence. Restoring an elapsed target is valid and shows completion, even though applying a newly entered past target is rejected.
- Produce no audio during countdown or completion.
- Dependency versions are implementation-time compatibility choices. The user's supplied test dependencies define the requested testing stack, not a request to downgrade the existing application toolchain or add unrelated styling dependencies.

## Testing Decisions

- Use one primary automated seam: application-level component integration tests rendered through React Testing Library, with Vitest, user-event, jest-dom, and jsdom, as requested by the user.
- Test externally observable behavior through accessible controls and rendered output. Avoid assertions about internal state, hook structure, timer callback counts, or storage implementation details.
- Exercise the homepage and Countdown Timer through the application boundary: navigate to the tool, enter settings, apply them, project, return to settings, and restore the timer after remounting.
- Control the test clock for deterministic checks of valid and past Target Times, local-date interpretation, hour/minute/second transitions, zero clamping, and clock-based recovery. Include a target more than one hour away and restoration after the original target date has passed.
- Verify optional fields are initially blank, a blank title is hidden, custom completion text appears at zero, and a blank Completion Message leaves `00:00:00` visible.
- Verify edits do not change the running Target Time before reapplication, returning to settings does not stop timekeeping, and reload preserves the original dated target and configured text.
- Use a narrow Fullscreen API substitute in jsdom to exercise user-triggered requests and fullscreen-change handling. Verify settings visibility and the mouse-revealed return control through rendered behavior.
- Supplement automated tests with actual browser verification of entering fullscreen, `Esc` exit, mouse-based return, hidden settings, and readable projected layout. A jsdom fullscreen substitute does not establish native fullscreen correctness.
- There is no existing test framework or test-suite prior art in the repository. Add the requested testing stack using versions compatible with the current project during implementation.
- Run the feature tests and the existing lint and production-build checks during implementation. No application tests have been run as part of writing this spec.

## Out of Scope

- Additional tools beyond the homepage's Countdown Timer entry.
- Duration-based countdowns, dates other than today when configuring a new timer, and selectable remote time zones.
- Multiple simultaneous timers, recurring schedules, pause/resume controls, and stopwatch behavior.
- Accounts, backend services, cloud synchronization, shared timer links, and remote control across devices.
- Sounds, alerts, custom themes, image backgrounds, and event-specific default text.
- Installing a browser E2E framework as the primary automated testing seam.
- Hosting-provider selection and production deployment.

## Further Notes

The initial use case is on-site projection, but the product is a general-purpose Countdown Timer. Earlier event-specific wording was superseded by this decision.

The user confirmed the functional decisions through the design discussion and requested publication with to-spec. They selected the component integration testing stack above after reviewing the proposed testing seam. This spec is ready for implementation; publishing it does not itself implement or deploy the feature.
