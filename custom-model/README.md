EcoSort custom AI model folder
==============================

Put the exported TensorFlow.js model files here:

- model.json
- metadata.json
- weights.bin files

Recommended class names:

- Paper
- Cardboard
- Plastic Bottle
- Glass Bottle
- Metal Can
- Food Waste
- Banana Peel
- Apple
- Chip Packet
- Mixed Covered Bag

Training target:

- Minimum 100 images per class for demo quality
- Better: 250+ images per class
- Use different backgrounds, hand positions, lighting, distance, rotation
- Keep validation/test images separate from training images
- Aim for 90%+ validation accuracy before demo

Free training path:

1. Open Google Teachable Machine image project.
2. Create the classes listed above.
3. Add images for every class.
4. Train the model.
5. Export as TensorFlow.js.
6. Copy exported files into this folder.
7. Refresh the app.

When loaded correctly, the top status changes to "Custom AI ready".
