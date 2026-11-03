// ==========================================
// KONFIGURASI BIRTHDAY QUEST
// Kamu bisa sesuaikan teks, nama, dan pesan di sini!
// ==========================================

const CONFIG = {
  // Nama panggilan pacar & pengirim
  girlfriendName: "Sayang", // Ganti dengan nama pacar kamu, misal: "Dinda", "Caca", dll.
  boyfriendName: "Sodus",
  birthdayDate: "19 Desember 2026",

  // Pesan sambutan di awal game
  introDialog: [
    "Hai Sayang! Hari ini hari spesial kamu! 🎉",
    "Misi kamu: Kumpulkan semua memori & item kesukaan di sepanjang jalan.",
    "Buka gerbang ulang tahun di ujung perjalanan ya! Semangat! ❤️"
  ],

  // Item collectible dan pesan unik saat diambil
  collectibles: [
    { type: "boba", name: "Boba Brown Sugar", note: "Boba favorit kamu! Jangan ngambek lagi ya kalau telat pesan~ 🧋" },
    { type: "flower", name: "Buket Bunga", note: "Bunga cantik buat orang paling cantik di dunia! 🌸" },
    { type: "letter", name: "Surat Cinta", note: "Satu dari sejuta alasan kenapa aku sayang banget sama kamu. 💌" },
    { type: "cat", name: "Kucing Lucu", note: "Lucunya mirip kamu kalau lagi manja! 🐱" },
    { type: "key1", name: "Kunci Emas 1", note: "Kunci 1/3: Kunci tawa kita berdua! 🔑" },
    { type: "key2", name: "Kunci Emas 2", note: "Kunci 2/3: Kunci cerita manis kita! 🔑" },
    { type: "key3", name: "Kunci Emas 3", note: "Kunci 3/3: Gerbang kado terbuka! 🔑" },
  ],

  // Pesan surat cinta setelah tiup lilin
  letter: {
    title: "Happy Birthday, My Love! 🎂✨",
    date: "19 Desember 2026",
    paragraphs: [
      "Selamat ulang tahun ya! Terima kasih udah selalu jadi alasan aku tersenyum setiap hari.",
      "Semoga di usia yang baru ini, kamu selalu diberikan kesehatan, kebahagiaan, dan semua impian kamu tercapai satu per satu.",
      "Aku bakal selalu ada di samping kamu buat dukung dan nemenin setiap langkah kamu.",
      "I love you more than words can say. Once again, happy birthday sayangku! ❤️"
    ],
    closing: "Dari yang selalu sayang kamu,",
    sender: "Sodus"
  },

  // Link WhatsApp klaim kado (ganti nomormu dengan format 628xxx)
  whatsappNumber: "6281234567890",
  whatsappText: "Halo sayang, aku udah namatin Birthday Quest-nya nih! Mana kado spesialnya? 🎁❤️"
};
