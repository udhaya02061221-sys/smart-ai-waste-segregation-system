# EcoSort AI Training Plan

## Classes

| Class | Bin |
|---|---|
| Paper | Recycle |
| Cardboard | Recycle |
| Plastic Bottle | Recycle |
| Glass Bottle | Recycle |
| Metal Can | Recycle |
| Food Waste | Organic |
| Banana Peel | Organic |
| Apple | Organic |
| Chip Packet | Non-Recycle |
| Mixed Covered Bag | Warning / no bin open |

## Dataset Size

For a Monday demo, collect at least 100 images per class. For stronger accuracy, collect 250-500 images per class.

## Accuracy Target

Do not claim 90% from training accuracy alone. Use validation accuracy or test accuracy. The model should reach 90%+ on unseen images before claiming it.

## App Integration

Export the trained TensorFlow.js model into:

`outputs/eco-sort-ai/custom-model/`

The app auto-loads it before COCO-SSD.

## Cloud Storage Option

Use Google Drive or GitHub Releases/Pages to store dataset/model files. For browser deployment, the model files must be accessible by URL or copied into `custom-model`.
