## What is Normalization

When we rotate a shape on a coordinate plane, the rotation happens around the origin `(0,0)`. This often pushes the shape into negative coordinates. Normalization is the process of shifting it back so it fits perfectly in a `(0,0)` starting grid.

Imagine a style shape:

```
  # #   (1,0), (2,0)
# # #   (0,1), (1,1), (2,1)
```

Now let's rotate 90° clockwise: (x, y) → (y, -x)
```
(1, 0) → (0, -1)
(2, 0) → (0, -2)
(0, 1) → (1, 0)
(1, 1) → (1, -1)
(2, 1) → (1, -2)
```

> Let's take the point `(3, 2)` and rotate it 90° clockwise. This means you go right 3 and up 2.The Rotation: Imagine the line connecting the origin `(0,0)` to `(3,2)` as the hand of a clock. Move that hand 90° to the right. The "up 2" part now points right 2. The "right 3" part now points down 3. Result is `(2, -3)`.

> Why this works: The Slope Check
> 
> You can always check your work by looking at the slopes. The slope of the line to the original point `(3,2)` is `2/3`. The slope to the new point `(2, -3)` is `-3/2`. Since the slopes are negative reciprocals, the lines are guaranteed to be exactly 90° apart.

We have negative Y values. The shape has "fallen" below the x-axis. To fix this, we find the "bounding box" of the new shape and shift it back to the origin.

Step 1: Find the minimum x and y
- minX = 0
- minY = -2

Step 2: Translate (Shift): Subtract the minimums from every point.
```
(0, -1) -> (0, 1)
(0, -2) -> (0, 0)
(1, 0)  -> (1, 2)
(1, -1) -> (1, 1)
(1, -2) -> (1, 0)
```

Final normalized coordinates:

```
# #    (0,0), (1,0)
# #    (0,1), (1,1)
  #           (1,2)
```

Note that in mathematics, a translation is moving every point of a figure the same distance in a specified direction. Normalization is simply a specific type of translation. You are calculating a translation vector `(-minX, -minY)` and applying it to the entire set of points.

Below is an example of an implementation of the normalization.

```ts
function normalize(coords: Array<{x: number, y: number}>) {
  // Step 1: Find the smallest x and y
  const minX = Math.min(...coords.map(c => c.x));
  const minY = Math.min(...coords.map(c => c.y));
  
  // Step 2: Subtract them from all coordinates
  return coords.map(c => ({ 
    x: c.x - minX,
    y: c.y - minY
  }));
}
```
