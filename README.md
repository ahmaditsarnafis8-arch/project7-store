# Project 7 Ecommerce

Website e-commerce sederhana dengan halaman awal login, login user/admin, opsi Google, toko produk, keranjang, wishlist, promo code, dan panel admin.

## Jalankan lokal
1. Buka folder proyek.
2. Jalankan file [index.html](index.html) di browser, atau gunakan server statis sederhana.

## Login demo
- User: daftar akun baru lewat halaman registrasi
- Admin: login dengan username dan password tersimpan di aplikasi
- Login Google: tombol yang tersedia di halaman awal dan halaman login user (demo lokal)

## Fitur
- Halaman awal dengan pilihan login
- Login user dan admin
- Opsi login dengan Google (demo lokal)
- Toko produk dengan kategori dan pencarian
- Keranjang, wishlist, promo, checkout
- Panel admin untuk tambah/hapus produk

## Deploy ke Vercel
1. Push folder ini ke GitHub.
2. Buka Vercel, pilih Import Project, lalu pilih repository yang berisi folder ini.
3. Set root directory ke folder proyek ini jika repository memuat lebih dari satu folder.
4. Deploy secara otomatis.

## Firebase (opsional, untuk login Google nyata)
1. Buat project di Firebase.
2. Aktifkan Authentication > Google.
3. Isi nilai di [firebase-config.js](firebase-config.js) dengan konfigurasi project Anda.
4. Setelah itu tombol login Google akan siap digunakan.

