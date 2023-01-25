# vertical_scroller
## comment

This annotation allows the content of a uiContainer to scroll vertically, if they need more space than they get.

For example, if you create an element that is restricted in height:

```
@(pxHeight 200) uiContainer: 1 to 40.
```

Then you will only be able to see the first few numbers - you can not scroll down.
If you want to scroll down, simply add this annotation:

```
@verticalScroller
@(pxHeight 200) @verticalScroller uiContainer: 1 to 40.
```