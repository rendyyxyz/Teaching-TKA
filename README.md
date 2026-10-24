# Persiapan TKA SMA 2026

Situs belajar untuk TKA (Tes Kemampuan Akademik) 2026 — empat mata pelajaran dalam satu tempat: **Fisika, Matematika, Bahasa Inggris, dan Bahasa Indonesia**.

**Situs:** https://rendyyxyz.github.io/Teaching-TKA/ — *terkunci, hubungi pemilik untuk akses.*

---

## Tentang repositori ini

Ini adalah **build publik** dari proyek pribadi. Riwayat commit di sini mengikuti tanggal pengerjaan aslinya (26 September – 24 Oktober 2026), tetapi isinya adalah hasil build terenkripsi pada tiap tanggal, bukan kode sumbernya.

Kode sumber dan riwayat pengembangan lengkap tersimpan di repositori privat. Yang dipublikasikan di sini hanya hasil build yang sudah terenkripsi, supaya isi pelajaran tidak dapat dibaca tanpa kata sandi.

## Sekilas

<table>
<tr>
<td width="50%"><b>Halaman kunci</b><br><img src="docs/screenshots/01-lock.jpg" alt="Halaman kunci"></td>
<td width="50%"><b>Hub — pilih mata pelajaran</b><br><img src="docs/screenshots/02-hub-desktop.jpg" alt="Hub"></td>
</tr>
</table>

> Tangkapan layar isi pelajaran sengaja tidak dipublikasikan di sini — situsnya terkunci dengan kata sandi, dan gambar isi pelajaran di repositori publik akan membuka apa yang seharusnya dilindungi.

---

## Isi

| Mata pelajaran | Materi |
|---|---|
| **Fisika** | Kinematika, dinamika, termal, gelombang, optik, listrik |
| **Matematika** | Bilangan, aljabar, geometri, trigonometri, data & peluang |
| **Bahasa Inggris** | Reading comprehension, text types, grammar |
| **Bahasa Indonesia** | Teks informasi & fiksi, gagasan utama, hubungan antarparagraf |

Setiap mapel punya materi bertahap, bank soal, dan latihan dengan pembahasan.

## Mesin tryout

Halaman tryout Matematika memuat 30 soal; 25 di antaranya **diregenerasi setiap kali dimuat** dengan angka baru, dan pembahasannya ikut dihitung ulang. Tujuannya supaya yang dilatih adalah metodenya, bukan hafalan jawaban.

Ada juga tombol **"Ganti angka soal ini"** per soal, sehingga satu soal bisa diulang tanpa kehilangan jawaban soal lain.

## Keamanan

Seluruh isi situs disimpan **terenkripsi** (AES-256-GCM). Kunci diturunkan dari kata sandi memakai PBKDF2-SHA256 dengan 1.000.000 iterasi. Nama berkas pun di-hash, sehingga struktur situs tidak terlihat dari repositori.

Tanpa kata sandi, isi repositori ini hanya berupa ciphertext dan tidak dapat dibaca.

## Teknologi

HTML, CSS, dan JavaScript murni. Tanpa framework, tanpa backend, tanpa dependensi npm. Dekripsi dilakukan di browser oleh service worker, sehingga tidak ada server yang perlu dijalankan.

## Lisensi

Hak cipta dilindungi. Lihat [LICENSE](LICENSE).

Soal-soal pada halaman tryout Matematika diturunkan dari kertas ujian **TO-1 TKA Mapel Wajib — PROSUS INTEN (TA 2025/2026)** dan tetap menjadi milik penerbitnya.
