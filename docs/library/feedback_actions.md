# feedback_actions
## comment

Returns a set of actions which a user can use to send you feedback to an E-Mail address.
These actions work with three-dot buttons; you could use them like this, for example:

```
toolAtRight: void additionalActionsTool
(feedbackActions: "mail@example.com")
("Some other action"; {})
```