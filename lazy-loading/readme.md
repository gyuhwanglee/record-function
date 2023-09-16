1. Use the loading Attribute:
The HTML loading attribute can be used to specify how an element should be loaded. You can set it to "lazy" for images and videos to enable lazy loading. This attribute works in modern browsers that support it.
2. Intersection Observer API:
For browsers that do not support the loading attribute (especially older browsers), you can use the Intersection Observer API to implement lazy loading for videos. The Intersection Observer API allows you to track when an element enters or exits the viewport, and you can use this to trigger the loading of videos when they are near the visible area.
