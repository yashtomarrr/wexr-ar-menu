# 3D models go here

Drop each dish's real 3D files in this folder and reference them in
`data/menu.ts` (or upload them in the `/admin` panel):

```
public/models/
  butter-chicken.glb     # Android Scene Viewer + in-page 3D preview
  butter-chicken.usdz    # iPhone / iPad AR Quick Look
```

Then in the dish:

```ts
model:    '/models/butter-chicken.glb',
modelIos: '/models/butter-chicken.usdz',
```

## Tips
- **Author in metres.** `ar-scale="fixed"` shows the model life-size, so a model
  built at true plate size appears at the real serving size in AR.
- **Capture fast** with Polycam or KIRI Engine on a phone — both export GLB +
  USDZ from a quick scan of the real dish.
- Keep files lean (ideally < 5 MB) for fast loading on mobile data.

Until you add real files, dishes use a reliable AR-capable sample model so the
demo works out of the box.
