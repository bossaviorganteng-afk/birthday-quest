// ==========================================
// KONFIGURASI BIRTHDAY QUEST
// ==========================================

const CONFIG = {
  girlfriendName: "Sayang",
  boyfriendName: "Sodus",
  birthdayDate: "19 Desember 2026",

  introDialog: [
    "Hai Sayang! Hari ini hari spesial kamu! 🎉",
    "Misi kamu: Kumpulkan semua memori & item kesukaan di sepanjang jalan.",
    "Buka gerbang ulang tahun di ujung perjalanan ya! Semangat! ❤️"
  ],

  // Item collectible + pesan + foto memori
  collectibles: [
    { 
      type: "boba", 
      name: "Boba Brown Sugar", 
      note: "Boba favorit kamu! Jangan ngambek lagi ya kalau telat pesan~ 🧋",
      photo: "assets/photos/photo_2026-11-03_09-28-22.jpg"
    },
    { 
      type: "flower", 
      name: "Buket Bunga", 
      note: "Bunga cantik buat orang paling cantik di dunia! 🌸",
      photo: "assets/photos/photo_2026-11-03_09-28-23.jpg"
    },
    { 
      type: "letter", 
      name: "Surat Cinta", 
      note: "Satu dari sejuta alasan kenapa aku sayang banget sama kamu. 💌",
      photo: "assets/photos/photo_2026-11-03_09-28-24.jpg"
    },
    { 
      type: "cat", 
      name: "Kucing Lucu", 
      note: "Lucunya mirip kamu kalau lagi manja! 🐱",
      photo: "assets/photos/photo_2026-11-03_09-28-25.jpg"
    },
    { 
      type: "key1", 
      name: "Kunci Emas 1", 
      note: "Kunci 1/3: Kunci tawa kita berdua! 🔑",
      photo: "assets/photos/photo_2026-11-03_09-28-46.jpg"
    },
    { 
      type: "key2", 
      name: "Kunci Emas 2", 
      note: "Kunci 2/3: Kunci cerita manis kita! 🔑",
      photo: "assets/photos/photo_2026-11-03_09-28-47.jpg"
    },
    { 
      type: "key3", 
      name: "Kunci Emas 3", 
      note: "Kunci 3/3: Gerbang kado terbuka! 🔑",
      photo: "assets/photos/photo_2026-11-03_09-28-48.jpg"
    },
  ],

  // Galeri Foto Lengkap
  gallery: [
    "assets/photos/photo_2026-11-03_09-28-22.jpg",
    "assets/photos/photo_2026-11-03_09-28-23.jpg",
    "assets/photos/photo_2026-11-03_09-28-24.jpg",
    "assets/photos/photo_2026-11-03_09-28-25.jpg",
    "assets/photos/photo_2026-11-03_09-28-46.jpg",
    "assets/photos/photo_2026-11-03_09-28-47.jpg",
    "assets/photos/photo_2026-11-03_09-28-48.jpg",
    "assets/photos/photo_2026-11-03_09-28-52.jpg"
  ],

  // Video Kenangan Spesial
  videos: [
    { title: "Special Moment 1", src: "assets/videos/video1.mp4" },
    { title: "Special Moment 2", src: "assets/videos/video2.mp4" }
  ],

  // Pesan surat cinta
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

  whatsappNumber: "6285792563057",
  whatsappText: "sayangggg, aku udah selesaiin gamenya, kadonya manaaa????!!!"
};
