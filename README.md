# 💘 kalp-website

Kaçan "Hayır" butonlu, sevinen kedili çıkma teklifi sitesi.

- **Hayır**'a basmaya çalıştıkça buton kaçıyor, yazısı değişiyor, **Evet** ise büyüyor.
- **Evet** denince ekrana sevinen kedi GIF'leri ve konfeti yağıyor, arkada müzik çalıyor.
- Aynı anda sana bir e-posta gidiyor (Hayır'a kaç kez basmaya çalıştığı ve ne kadar düşündüğüyle birlikte 😄).

Her şeyi ayarlamak için sadece `config.js` dosyasını düzenlemen yeterli.

## 1. Yayına al (GitHub Pages)

1. Ücretsiz GitHub Pages için repo **public** olmalı:
   Settings → General → en altta *Change repository visibility* → **Public**.
   (GitHub Pro'n varsa private kalabilir.)
2. Settings → **Pages** → Source: *Deploy from a branch* → Branch: `main` (ya da bu dalı merge etmediysen
   `claude/proposal-website-kdkvte`) ve `/ (root)` → **Save**.
3. 1-2 dakika sonra site şu adreste açılır: **https://asafgiray.github.io/kalp-website/**

> Repoyu public yapmak istemezsen Netlify, Vercel ya da Cloudflare Pages'e private repoyu bağlayarak da ücretsiz yayınlayabilirsin.

## 2. E-posta bildirimini aktive et (önemli!)

Mailler [FormSubmit](https://formsubmit.co) ile, `config.js` içindeki `email` adresine gider.

1. Site yayına girdikten sonra **kendin bir kez Evet'e bas.**
2. FormSubmit'ten gelen **"Activate Form"** mailindeki butona tıkla (spam klasörüne de bak).
3. Bundan sonraki her "Evet" sana *"💖 EVET DEDİ! 💖"* başlıklı bir mail olarak gelir.

Kendin denemek için siteyi sonuna `?test` ekleyerek açarsan mail gönderilmez:
`https://asafgiray.github.io/kalp-website/?test`

> Repo public olunca `config.js` içindeki e-posta adresi herkese görünür. Aktivasyondan sonra FormSubmit
> sana rastgele bir kod verir; adresin yerine onu yazarak adresini gizleyebilirsin.

## 3. Happy happy happy kedi müziği

"Happy happy happy cat" mp3 dosyasını (örneğin [myinstants](https://www.myinstants.com/en/instant/happy-happy-happy-cat-17367/)
sayfasındaki *Download MP3* ile) indir ve `assets/happy-happy-happy.mp3` adıyla yükle
(GitHub'da `assets` klasörüne gir → *Add file* → *Upload files*).

Dosya yoksa site, yedek olarak kendi neşeli melodisini çalar.

## 4. QR kod

`kalp-qr.png` doğrudan **https://asafgiray.github.io/kalp-website/** adresine gider.
Siteyi başka bir adreste yayınlarsan, sitenin sonuna `/qr.html` ekleyip açarak o adres için yeni QR kodu indirebilirsin.

## Kişiselleştirme (`config.js`)

| Ayar | Ne işe yarar |
| --- | --- |
| `name` | Sevgilinin adı; başlık "Ad, sevgilim olur musun?" olur |
| `email` | "Evet" bildiriminin gideceği adres |
| `music` | Çalacak mp3 dosyası ya da linki |
| `questionCats` | Soru kartındaki kediler (normal → yalvaran → ağlayan) |
| `happyCats` | "Evet" sonrası sevinen kediler (Tenor GIF'leri ya da kendi gif/mp4 dosyaların; ilki büyük gösterilir) |
