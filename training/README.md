# EcoSort Nexus AI Training Package

This folder is for training the real webcam model and exporting it into the web app.

## Current Plan

The app now supports a broader real-world route table:

- Recycle: Paper, Cardboard, Plastic Bottle, Hard Plastic Container, Steel Bottle, Sip Bottle Cup, Glass Bottle, Metal Can.
- Organic: Food Waste, Banana Peel, Apple.
- Non-Recycle: Chip Packet, Plastic Cover, Pen, Rubber, Phone, Phone Case, Battery, Shoe, Cloth.
- Warning: Mixed Covered Bag, opaque bundle, mixed transparent bundle.

## Legal Open-Source Sources

Use open/public datasets instead of random Google scraping:

- TrashNet: paper, cardboard, plastic, glass, metal, trash.
- TACO: open waste/litter images with wrappers, bottles, cans, paper, plastic film, and mixed litter.
- Garbage Dataset / D.Waste: metal, glass, biological, paper, battery, trash, cardboard, shoes, clothes, plastic.
- RealWaste: landfill waste images across material categories.

Random Google/ChatGPT image scraping is not recommended because the labels are noisy, licenses are unclear, and demo accuracy becomes unstable.

## Export Target

After training, export TensorFlow.js files into:

```text
outputs/eco-sort-ai/custom-model/
 model.json
 metadata.json
 group*.bin
```

`metadata.json` must contain the final labels in training order and:

```json
{
  "imageSize": 224,
  "preprocess": "embedded_mobilenet_v2"
}
```

## Bundle Logic

Transparent bundles need special handling:

- If the visible inside objects are mostly one route, use that route.
- If route types are mixed, unclear, or covered, use `Mixed Covered Bag`.
- `Mixed Covered Bag` triggers six warning beeps and no bin opens.

Open-source datasets can help, but transparent-bag accuracy improves only when the model sees transparent-bag examples. If user photos are not possible, use TACO/plastic-film and garbage-bag images as the closest public-data substitute.

## Accuracy Rule

Only claim 90% after validation/test accuracy is 90%+ on unseen images. Open data can improve coverage, but real webcam lighting/background still decides final demo reliability.
