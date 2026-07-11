# EcoSort Nexus

Smart AI powered automatic waste segregation system demo.

## Features

- Live webcam workflow with one-object sorting cycle.
- Recycle, Organic, Non-Recycle, and Warning routing.
- Smart bin simulator with glow, lid opening, waste drop, and percentage update.
- Bin fill percentage and approximate weight tracking.
- Full-bin alerts, reset flow, report history, CSV download, and delete report.
- Cloud AI API support for Roboflow-style waste detection endpoints.
- Hardware-ready dashboard for camera, AI model, servo, buzzer, ultrasonic sensors, and notifications.

## Run Locally

Open this folder in VS Code, then run:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8765/
```

## Demo Flow

1. Open `Live Control`.
2. Click `Start Camera`.
3. Place one object inside the scan box.
4. Click `Live AI`.
5. The app automatically opens the simulator, animates the correct bin, then opens the percentage page.
6. For the next object, click `Live AI` again.

## Supported Routes

Recycle:
Paper, Notebook, Cardboard, Plastic Bottle, Hard Plastic Container, Steel Bottle, Sip Bottle Cup, Glass Bottle, Metal Can.

Organic:
Food Waste, Banana Peel, Apple.

Non-Recycle:
Chip Packet, Biscuit Packet, Plastic Cover, Pen, Rubber, Phone, Phone Case, Battery, Shoe, Broken Slipper, Rubber Slipper, Leather Slipper, Cloth.

Warning:
Mixed Covered Bag or unclear covered bundle. The app gives six warning beeps and does not open a bin.

## Cloud AI API

The Hardware page has a Cloud AI API section.

Example API URL:

```text
https://serverless.roboflow.com/waste-classification-uwqfy/1
```

Paste your API key and click `Save API`. Live AI will use the cloud endpoint first, then local fallback logic if the API is unavailable.

## Render Deploy

This project includes `render.yaml`.

Render settings:

- Type: Static Site
- Build Command: leave empty
- Publish Directory: `.`

## Test

```bash
node test-object-routes.js
```

This verifies 25 object routes and common AI label aliases.
