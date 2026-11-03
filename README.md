# 🎂 Birthday Quest 19.12 — Pixel Mini-Game

Sebuah mini-game pixel 2D retro romantis spesial untuk merayakan ulang tahun pacar tercinta pada tanggal **19 Desember 2026**! 🎉💖

Dibuat menggunakan HTML5 Canvas murni + Web Audio API 8-Bit Chiptune tanpa ketergantungan library berat, sehingga super ringan, responsif di HP (layar sentuh) & Laptop/PC, serta bisa dimainkan langsung via **GitHub Pages**.

---

## 🎮 Fitur Mini-Game

1. **Stage 1: Memory Lane**
   - Kumpulkan item-item kenangan manis (Boba kesukaan, Buket Bunga, Surat Cinta, Kucing Lucu).
   - Setiap item menampilkan catatan/pesan singkat manis.
2. **Stage 2: Golden Keys**
   - Tantangan platformer ringan untuk mencari 3 Kunci Emas rahasia pembuka Gerbang Ulang Tahun.
3. **Stage 3: Grand Celebration**
   - Kue ulang tahun raksasa 3 tingkat dengan 3 lilin menyala.
   - Fitur interaktif: **Klik / sentuh lilin untuk meniupnya**!
   - Efek ledakan kembang api & konfeti pixel warna-warni.
   - Lagu 8-Bit Chiptune **"Happy Birthday"** otomatis berputar.
   - Pop-up surat cinta personal & tombol langsung klaim kado via WhatsApp.
4. **Kontrol Ramah Pengguna**:
   - Keyboard PC: Panah Kiri/Kanan atau A/D, Spasi / Atas / W untuk melompat.
   - Layar Sentuh HP: Tombol virtual D-Pad kiri, kanan, dan lompat.

---

## ⚙️ Kustomisasi Pesan & Nama (Mudah Sekali!)

Cukup buka file `config.js` di teks editor, lalu ubah nilainya sesuai keinginan kamu:

```javascript
const CONFIG = {
  girlfriendName: "Nama Pacar Kamu",
  boyfriendName: "Nama Kamu",
  birthdayDate: "19 Desember 2026",
  // Edit pesan surat cinta, item favorit, dan nomor WhatsApp
  whatsappNumber: "628xxxxxxxxxx",
  whatsappText: "Halo sayang, aku udah namatin Birthday Quest-nya nih! Mana kado spesialnya? 🎁❤️"
};
```

---

## 🚀 Cara Menampilkan Game di GitHub Pages (Biar Pacar Bisa Buka via Link)

1. Buka repositori ini di GitHub: `https://github.com/bossaviorganteng-afk/birthday-quest`
2. Klik tab **Settings** di kanan atas.
3. Di menu sebelah kiri, pilih **Pages**.
4. Di bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: pilih **main** / **root** lalu klik **Save**.
5. Tunggu 1–2 menit, link game kamu akan aktif di:
   `https://bossaviorganteng-afk.github.io/birthday-quest/`
6. Kirim link tersebut ke pacar kamu di tanggal 19 Desember! 🎁💌
