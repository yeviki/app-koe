📌 Cara Menggunakan dalam Routing
Manual Mode (role lama)

Masih bisa:
```
router.get("/", auth, role(null, null, 1, 2, 3), getMenu);
```

Dynamic Mode (dengan module + control)

Seperti:
```
router.post("/", auth, role("menu", "create"), createMenu);
router.put("/:id", auth, role("menu", "update"), updateMenu);
router.delete("/:id", auth, role("menu", "delete"), deleteMenu);
```

Untuk bypass routes seperti dibawah ini :
```
// GET COMBO STATUS → bypass pengecekan role
router.get("/combo-status", auth, role(null, null), getComboStatus);
```


Table: app_settings
id | key               | value
1  | application_mode  | normal


Value yang mungkin:

normal

maintenance

<!-- Cara Pakai Global Upload -->
📌 Cara Pakai (REAL CASE)
✅ 1️⃣ Single Upload (tetap bisa)
const upload = require("../middlewares/upload");

router.post(
  "/nasabah",
  upload({
    single: "foto_ktp",
    destination: "uploads/nasabah",
  }),
  nasabahController.createNasabah
);


➡️ req.file

✅ 2️⃣ Multi Field Upload
router.post(
  "/nasabah",
  upload({
    destination: "uploads/nasabah",
    fields: [
      { name: "foto_ktp", maxCount: 1 },
      { name: "foto_nasabah", maxCount: 1 },
      { name: "foto_rumah", maxCount: 1 },
      { name: "foto_usaha", maxCount: 1 },
      { name: "foto_promise", maxCount: 1 },
    ],
  }),
  nasabahController.createNasabah
);


➡️ req.files

✅ 3️⃣ Custom MIME & Size per endpoint
upload({
  single: "dokumen",
  destination: "uploads/dokumen",
  allowedMime: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
  maxSize: 5 * 1024 * 1024, // 5MB
});