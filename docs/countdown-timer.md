# Countdown Timer

Status: Scope confirmed through the user's request to publish a spec. Implementation has not started.

## Confirmed decisions

- Tool Hub is a static website containing multiple tools; Countdown Timer is the first tool.
- The timer is general-purpose. Use neutral labels and no event-specific default message.
- The first version serves on-site projection with simple operation.
- The user specifies a Target Time rather than a countdown duration.
- When the countdown reaches zero, display a user-defined Completion Message.
- The projection screen shows a title and large countdown digits on a dark background with white text.
- Provide a fullscreen button and hide the settings while projecting.
- Only today's start time can be entered, interpreted in the projection computer's local time. Reject an already-passed time when configuring a countdown.
- Display remaining time in a fixed `HH:MM:SS` format.
- Persist the title, the original dated Target Time, and Completion Message in the same browser. Reloading resumes the countdown against the original Target Time; if it has passed, show the completion state.
- Pressing `Esc` to exit fullscreen reveals settings. Moving the mouse while projecting temporarily reveals a return-to-settings button.
- Returning to settings does not stop the countdown. An edited Target Time takes effect only when reapplied.
- Provide a simple tool homepage with one Countdown Timer card linking to a dedicated tool page, with room for additional tools later.
- Completion is silent; no sound plays.
- The title and Completion Message are optional and blank by default. A blank title is hidden. At zero, show the entered Completion Message, or retain `00:00:00` if no message was entered.

## Testing approach

Use Vitest, React Testing Library, user-event, jest-dom, and jsdom for application-level component integration tests. Verify native fullscreen and projection behavior in a real browser. The user supplied this testing stack in place of the proposed browser E2E framework; specific compatible dependency versions must be checked during implementation.
