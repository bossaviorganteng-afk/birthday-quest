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

  // Item collectible + pesan + foto memori (disesuaikan dengan foto asli)
  collectibles: [
    { 
      type: "boba", 
      name: "Makan Udon Berdua", 
      note: "Muka bahagia kamu waktu makan udon enak! Selalu gemes liat kamu makan lahap begini~ 🍜😋",
      photo: "assets/photos/photo_2026-11-03_09-28-22.jpg"
    },
    { 
      type: "flower", 
      name: "Pose Bibir Manyun", 
      note: "Pose andalan kalau lagi iseng atau ngeledek! Biarpun manyun tetep paling manis sedunia~ 😚✨",
      photo: "assets/photos/photo_2026-11-03_09-28-23.jpg"
    },
    { 
      type: "letter", 
      name: "Tatapan Muka Judes", 
      note: "Kamera diarahkan, muka langsung pasang ekspresi skeptical! Galak-galak tapi ngangenin~ 😜❤️",
      photo: "assets/photos/photo_2026-11-03_09-28-24.jpg"
    },
    { 
      type: "cat", 
      name: "Video Call Kocak", 
      note: "Momen video call malem-malem sambil melet & peluk bantal. Selalu nemenin sebelum tidur! 📱🛌",
      photo: "assets/photos/photo_2026-11-03_09-28-25.jpg"
    },
    { 
      type: "key1", 
      name: "Kunci 1: Boba & Winky Face", 
      note: "Kencan beli matcha & jajanan event bareng! Seru banget jalan desak-desakan tapi berdua~ 🥤😉",
      photo: "assets/photos/photo_2026-11-03_09-28-46.jpg"
    },
    { 
      type: "key2", 
      name: "Kunci 2: Candid Cantik di Kafe", 
      note: "Duduk santai di kafe kaca sambil lirik pemandangan. Senyum manisnya bikin adem hati! ☕🌿",
      photo: "assets/photos/photo_2026-11-03_09-28-47.jpg"
    },
    { 
      type: "key3", 
      name: "Kunci 3: Senyum Manis Behel", 
      note: "Senyum paling mempesona yang selalu bikin hari-hariku cerah! I love your pretty smile! 😁💖",
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
