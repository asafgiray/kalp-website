// 💌 Siteyi kişiselleştirmek için sadece bu dosyayı düzenlemen yeterli.
window.KALP_CONFIG = {
  // Sevgilinin adı. Doldurursan başlık "Ayşe, sevgilim olur musun?" gibi görünür.
  name: "",

  // "Evet" denince haber gelecek e-posta adresi (FormSubmit.co ile gönderilir).
  // İlk gönderimde FormSubmit bu adrese bir "Activate Form" maili yollar, onu onaylaman gerekir.
  // Onaydan sonra FormSubmit sana rastgele bir kod verir; adresini gizlemek için buraya onu yazabilirsin.
  email: "girayasafdurmus@gmail.com",

  // "Happy happy happy" kedi müziği. assets klasörüne bu isimle bir mp3 yükle
  // ya da buraya doğrudan bir mp3 linki yaz. Dosya bulunamazsa site kendi neşeli melodisini çalar.
  music: "assets/happy-happy-happy.mp3",

  // Soru kartındaki kedi: [normal, yalvaran (3+ hayır denemesi), ağlayan (8+ hayır denemesi)]
  // Tenor GIF linkinin "tenor.com/view/" sonrasındaki kısmı ya da kendi gif dosyan (örn. "assets/kedi.gif").
  questionCats: [
    "heart-cute-cat-love-smiling-cat-gif-11245480530270999383",
    "cat-begging-sad-reaction-please-gif-12038475",
    "fat-sad-cat-cry-sorry-gif-7589369",
  ],

  // "Evet" sonrası ekranda beliren sevinen kediler. İlki büyük olarak ortada gösterilir.
  // Kendi gif ya da mp4 dosyalarını da kullanabilirsin (örn. "assets/kedi.mp4").
  happyCats: [
    "assets/opucuk-kedi.mp4",
    "happy-happy-happy-cat-gif-12987138006651541996",
    "happy-happy-happy-happy-happy-cat-happy-dancing-cat-gif-17725371557386627543",
    "happy-cat-dancing-cat-excited-excited-cat-yay-cat-gif-12879238417633096553",
    "happy-cat-dancing-cat-gif-10117121347253311572",
    "cat-happy-cat-dancing-cat-dance-cat-meme-cats-gif-18148399523684423227",
    "happy-dance-cat-gif-8551718640888809253",
  ],
};
