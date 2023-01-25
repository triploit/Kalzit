# columns
## comment

An annotation which causes the elements inside of a UI container to be displayed in columns.
For example, if you have two longer pieces of text, which you want to put side by side, you can do this:

$textA = "First long text".
$textB = "Second long text".
print: @(columns 2) uiContainer textA;textB.

If you specify the width of an element manually and place it into a container which is marked with @columns, that element will keep its width and NOT make the entire thing appear as a grid.
The annotation also allows you to specify the number of columns (by using a parameter greater than zero). As an example, you can use @(columns 4) to get four.

If you do not want to specify the column count yourself, or prefer a way which does not use annotations, consider using the "uiColumns" function instead.