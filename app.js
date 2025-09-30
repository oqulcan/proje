// ==========================================================
// app.js - MİNİMAL OPTİMİZASYONLU VERSİYON
// ==========================================================

// ==========================================================
// 5. GÜN: Ürün Verileri
// ==========================================================
const urunListesi = [
    { id: 1, ad: "Pilav", fiyat: 120, aciklama: "Klasik lezzet durağı.", resim: "pilav.jpg" },
    { id: 2, ad: "Pizza Margherita", fiyat: 150, aciklama: "İtalyan mutfağının incisi.", resim: "pizza.jpg" },
    { id: 3, ad: "Salata", fiyat: 80, aciklama: "Sağlıklı ve taze seçenek.", resim: "salata.jpg" },
    { id: 4, ad: "Hünkar Beğendi", fiyat: 500, aciklama: "Sağlıklı ve en taze seçenek", resim: "beğendi.jpg" },
    { id: 5, ad: "Domates Çorbası", fiyat: 140, aciklama: "Anne eli değmiş gibi", resim: "çorba.jpg" } // Format sorunu potansiyelini azaltmak için .jpg yapıldı.
];

// ==========================================================
// 4, 5, 7, 9, 10, 11, 17. Gün: DOM Seçiciler
// ==========================================================
const urunlerKapsayici = document.querySelector('.product-grid'); 
const baslik = document.querySelector('h1');
// const menuButon = document.querySelector('.menu-btn'); // Kaldırıldı, kullanılmıyor
const sepetListesiKapsayici = document.querySelector('#sepet-listesi'); 
const toplamTutarSpan = document.querySelector('#toplam-tutar'); 
const sepetUrunSayisiSpan = document.querySelector('#sepet-urun-sayisi'); 

// 9. GÜN: Oturum Yönetimi DOM Seçicileri
const formContainer = document.querySelector('#form-container'); 
const loginModal = document.querySelector('#login-form-modal');
const registerModal = document.querySelector('#register-form-modal');
const oturumBilgisiDiv = document.querySelector('#oturum-bilgisi');
const submitLoginBtn = document.querySelector('#submit-login');
const submitRegisterBtn = document.querySelector('#submit-register');
const loginMessage = document.querySelector('#login-message');
const registerMessage = document.querySelector('#register-message');
const closeButtons = document.querySelectorAll('.close-modal');

// 10. GÜN: Sipariş Formu DOM Seçicileri
const tamamlaBtn = document.querySelector('#tamamla-btn'); 
const checkoutModal = document.querySelector('#checkout-form-modal');
const checkoutName = document.querySelector('#checkout-name');
const checkoutAddress = document.querySelector('#checkout-address');
const checkoutPhone = document.querySelector('#checkout-phone');
const checkoutPaymentMethod = document.querySelector('#checkout-payment-method');
const checkoutMessage = document.querySelector('#checkout-message');
const submitCheckoutBtn = document.querySelector('#submit-checkout');
// const closeCheckoutBtn = document.querySelector('#close-checkout'); // Kaldırıldı, close-modal ile yönetiliyor

// 11. GÜN: Sipariş Geçmişi DOM Seçicileri
const siparisGecmisiAlani = document.querySelector('#siparis-gecmisi-alani');
const siparislerListesi = document.querySelector('#siparisler-listesi');
const gecmisMesaj = document.querySelector('#gecmis-mesaj');
const detayModal = document.querySelector('#detay-modal');
const detayOrderId = document.querySelector('#detay-order-id');
const detayDate = document.querySelector('#detay-date');
const detayAddress = document.querySelector('#detay-address');
const detayUrunlerListesi = document.querySelector('#detay-urunler-listesi');
const detayTotal = document.querySelector('#detay-total');
const closeDetayModalBtn = document.querySelector('#close-detay-modal');
const gecmisBtn = document.querySelector('#gecmis-btn');


// 17. GÜN: Asenkron Simülasyon Seçicileri (Yeni Eklendi)
const checkoutSpinner = document.querySelector('#checkout-spinner'); // Loading animasyonunun göründüğü yer
const checkoutFormContent = document.querySelector('#checkout-form-content'); // Form içeriğinin göründüğü yer


// ==========================================================
// LocalStorage Veri Yüklemeleri
// ==========================================================
let sepet = JSON.parse(localStorage.getItem('sepet')) || []; 
let siparisGecmisi = JSON.parse(localStorage.getItem('siparisGecmisi')) || [];


// ==========================================================
// 4. GÜN: Basit DOM Manipülasyonu
// ==========================================================
function basligiDegistir() {
    if (baslik.innerHTML === 'Lezzet Durağı') {
        baslik.innerHTML = 'Afiyet Olsun! - Sipariş Hazır';
    } else {
        baslik.innerHTML = 'Lezzet Durağı';
    }
}
// menuButon.addEventListener('click', basligiDegistir); // Kullanılmayan Listener Kaldırıldı


// ==========================================================
// 5. GÜN: Dinamik Ürün Listesi Oluşturma
// ==========================================================
function urunleriYukle() {
    urunlerKapsayici.innerHTML = ''; 

    urunListesi.forEach(urun => {
        const kart = document.createElement('article');
        kart.classList.add('food-card');
        kart.dataset.urunId = urun.id; 

        kart.innerHTML = `
            <img src="${urun.resim}" alt="${urun.ad}">
            <h3>${urun.ad}</h3>
            <p class="aciklama">${urun.aciklama}</p>
            <p class="fiyat">${urun.fiyat} TL</p>
            <button class="siparis-btn" data-id="${urun.id}">Sepete Ekle</button> 
        `;
        
        urunlerKapsayici.appendChild(kart);
    });
}
urunleriYukle(); 


// ==========================================================
// 8. GÜN: Sepet Arayüzünü Çizme
// ==========================================================
function sepetiDOMaYukle() {
    sepetListesiKapsayici.innerHTML = ''; 

    if (sepet.length === 0) {
        sepetListesiKapsayici.innerHTML = '<p id="sepet-bos-mesaj">Sepetiniz şimdilik boş.</p>';
        return;
    }
    
    sepet.forEach(urun => {
        const sepetUrun = document.createElement('div');
        sepetUrun.classList.add('sepet-urun');
        
        sepetUrun.innerHTML = `
            <div class="urun-bilgi">
                <p>${urun.ad} </p>
                <div class="adet-yonetimi">
                    <button class="azalt-btn" data-id="${urun.id}">-</button>
                    <span>${urun.adet}</span>
                    <button class="arttir-btn" data-id="${urun.id}">+</button>
                </div>
            </div>
            <div class="urun-fiyat">
                <p>${(urun.fiyat * urun.adet).toFixed(2)} TL</p>
                <button class="sil-btn" data-id="${urun.id}">X</button> 
            </div>
        `;
        sepetListesiKapsayici.appendChild(sepetUrun);
    });
}


// ==========================================================
// 8. GÜN: Merkezi Sepet Güncelleme
// ==========================================================
function sepetiGuncelle() {
    // Toplam Tutarı Hesapla (reduce)
    const toplamTutar = sepet.reduce((toplam, urun) => toplam + (urun.fiyat * urun.adet), 0);
    toplamTutarSpan.textContent = toplamTutar.toFixed(2);
    
    // Toplam Ürün Sayısını Hesapla
    const toplamAdet = sepet.reduce((toplam, urun) => toplam + urun.adet, 0);
    sepetUrunSayisiSpan.textContent = toplamAdet;

    // DOM Güncellemesini yap
    sepetiDOMaYukle(); 

    // LocalStorage'a kaydet 
    localStorage.setItem('sepet', JSON.stringify(sepet));
}

// ==========================================================
// 7. GÜN: Sepete Ekleme Mantığı (Artırma)
// ==========================================================
function sepeteUrunEkle(urunID) {
    const urunIDNumber = Number(urunID);
    const mevcutUrun = sepet.find(urun => urun.id === urunIDNumber);
    
    if (mevcutUrun) {
        mevcutUrun.adet += 1;
    } else {
        const eklenecekUrun = urunListesi.find(urun => urun.id === urunIDNumber);
        if (eklenecekUrun) {
            sepet.push({ ...eklenecekUrun, adet: 1 });
        }
    }
    
    sepetiGuncelle();
}

// ==========================================================
// 8. GÜN: Sepet Yönetimi İşlevleri (Azaltma, Silme)
// ==========================================================
function sepettenSil(urunID) {
    const urunIDNumber = Number(urunID);
    sepet = sepet.filter(urun => urun.id !== urunIDNumber); 
    sepetiGuncelle(); 
}

function sepettenAzalt(urunID) {
    const urunIDNumber = Number(urunID);
    const mevcutUrun = sepet.find(urun => urun.id === urunIDNumber);

    if (mevcutUrun) {
        mevcutUrun.adet -= 1;

        if (mevcutUrun.adet === 0) {
            sepettenSil(urunID); 
        } else {
            sepetiGuncelle();
        }
    }
}


// ==========================================================
// 9. GÜN: Oturum Yönetimi Mantığı (Simülasyon)
// ==========================================================
function handleRegister() {
    const name = document.querySelector('#register-name').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;
    const passwordConfirm = document.querySelector('#register-password-confirm').value;

    loginMessage.textContent = "";
    registerMessage.textContent = "";

    if (!name || !email || !password || !passwordConfirm) {
        registerMessage.textContent = "Lütfen tüm alanları doldurun.";
        registerMessage.style.color = '#e74c3c';
        return;
    }
    if (password !== passwordConfirm) {
        registerMessage.textContent = "Şifreler eşleşmiyor!";
        registerMessage.style.color = '#e74c3c';
        return;
    }

    const userData = { name: name, email: email, password: password };
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    registerMessage.textContent = "Kayıt başarılı! Şimdi giriş yapabilirsiniz.";
    registerMessage.style.color = 'green';
}

function handleLogin() {
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    const storedData = JSON.parse(localStorage.getItem('registeredUser'));

    loginMessage.textContent = "";
    registerMessage.textContent = "";

    if (!storedData) {
        loginMessage.textContent = "Kayıtlı kullanıcı bulunamadı. Lütfen önce kayıt olun.";
        loginMessage.style.color = '#e74c3c';
        return;
    }

    if (email === storedData.email && password === storedData.password) {
        localStorage.setItem('currentUser', storedData.name); 
        renderSessionState(); 
        loginModal.style.display = 'none';
        formContainer.style.display = 'none';
        return;
    } else {
        loginMessage.textContent = "Hatalı e-posta veya şifre.";
        loginMessage.style.color = '#e74c3c';
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    renderSessionState();
    switchPage('ana'); // Çıkış yapınca ana sayfaya dön
}

function renderSessionState() {
    const userName = localStorage.getItem('currentUser');
    
    // HTML kodunuzdaki buton yapısını koruyarak tekrar oluşturuyoruz
    if (userName) {
        // Oturum Açık
        oturumBilgisiDiv.innerHTML = `
            <button id="gecmis-btn" class="menu-btn">Geçmiş Siparişler</button> 
            <span style="margin-right: 15px;">Hoş geldiniz, ${userName}</span>
            <button id="logout-btn" class="menu-btn">Çıkış Yap</button>
        `;
        document.querySelector('#logout-btn').addEventListener('click', handleLogout); 
        document.querySelector('#gecmis-btn').addEventListener('click', function() { switchPage('gecmis'); });
    } else {
        // Oturum Kapalı
        oturumBilgisiDiv.innerHTML = `
            <button id="login-btn" class="menu-btn">Giriş Yap</button>
            <button id="register-btn" class="menu-btn">Kayıt Ol</button>
        `;
        // Yeni butonlara listenerları tekrar ekle
        document.querySelector('#login-btn').addEventListener('click', () => {
            loginModal.style.display = 'flex';
            registerModal.style.display = 'none';
            checkoutModal.style.display = 'none'; 
            formContainer.style.display = 'flex'; 
            loginMessage.textContent = "";
        });
        document.querySelector('#register-btn').addEventListener('click', () => {
            registerModal.style.display = 'flex';
            loginModal.style.display = 'none';
            checkoutModal.style.display = 'none'; 
            formContainer.style.display = 'flex'; 
            registerMessage.textContent = "";
        });
    }
}

// ==========================================================
// 10. GÜN: Sipariş Onay ve Validasyon Mantığı
// ==========================================================

function validateCheckoutForm() {
    checkoutMessage.textContent = '';
    
    const name = checkoutName.value.trim();
    const address = checkoutAddress.value.trim();
    const phone = checkoutPhone.value.trim();
    const payment = checkoutPaymentMethod.value;

    if (sepet.length === 0) {
        checkoutMessage.textContent = "Sepetiniz boşken sipariş verilemez!";
        return false;
    }

    if (!name || !address || !phone || !payment) {
        checkoutMessage.textContent = "Lütfen tüm gerekli alanları doldurun.";
        return false;
    }

    if (!/^\d{10}$/.test(phone)) { 
        checkoutMessage.textContent = "Telefon numarası 10 haneli rakamlardan oluşmalıdır.";
        return false;
    }

    return true; 
}


// ==========================================================
// 17. GÜN: Asenkron Sipariş Simülasyonu (Güncellendi)
// ==========================================================
function completeOrder() {
    if (!validateCheckoutForm()) {
        return; 
    }

    // 1. Loading Durumunu Başlat
    // HTML yapınızı korumak için, burada sadece form içeriğini gizleyip, spinner'ı gösteriyoruz.
    // Spinner'ın kendisi HTML'de elle yazıldığı için, onun stilini değiştirmeyi atlayabiliriz.
    const loadingSpinnerDiv = document.querySelector('#checkout-form-modal #loading-spinner');
    if (loadingSpinnerDiv) loadingSpinnerDiv.style.display = 'block';

    if (checkoutFormContent) checkoutFormContent.style.display = 'none';
    if (checkoutSpinner) checkoutSpinner.style.style.display = 'block'; // Yeni spinner

    checkoutMessage.textContent = 'Siparişiniz işleniyor...';
    checkoutMessage.style.color = '#f7a000'; // Turuncu renkte loading mesajı

    // 2. Asenkron İşlem Simülasyonu (3 saniye gecikme)
    setTimeout(() => {
        // --- Gecikme Sonrası Yapılacak Asıl İşlemler Başlangıcı ---

        // Sipariş Bilgilerini Oluşturma
        const orderDetails = {
            orderId: Date.now(), 
            date: new Date().toLocaleString(),
            user: localStorage.getItem('currentUser') || 'Misafir',
            items: sepet, 
            total: sepet.reduce((sum, item) => sum + (item.fiyat * item.adet), 0),
            shipment: {
                name: checkoutName.value.trim(),
                address: checkoutAddress.value.trim(),
                phone: checkoutPhone.value.trim(),
                payment: checkoutPaymentMethod.value
            }
        };

        siparisGecmisi.push(orderDetails);
        localStorage.setItem('siparisGecmisi', JSON.stringify(siparisGecmisi));

        // Sepeti Sıfırlama
        sepet = [];
        sepetiGuncelle(); 

        // 3. Başarılı Durumu ve Kapanışı Yönet
        checkoutMessage.textContent = `Siparişiniz (${orderDetails.orderId}) başarıyla alındı!`;
        checkoutMessage.style.color = 'green';
        
        if (loadingSpinnerDiv) loadingSpinnerDiv.style.display = 'none'; // Spinner'ı Kapat

        setTimeout(() => {
            checkoutModal.style.display = 'none';
            formContainer.style.display = 'none';
            // Formu ve spinner'ı bir sonraki kullanım için sıfırla
            if (checkoutFormContent) checkoutFormContent.style.display = 'flex';
            if (loadingSpinnerDiv) loadingSpinnerDiv.style.display = 'none';

            switchPage('ana'); // Sipariş bitince ana sayfaya dön
        }, 1500); // Başarılı mesajını göstermek için kısa bekleme

        // --- Gecikme Sonrası Yapılacak Asıl İşlemler Bitişi ---
    }, 3000); // 3000 milisaniye = 3 saniye bekleme
}


// ==========================================================
// 11. GÜN: Sipariş Geçmişi Yönetimi
// ==========================================================

// Ana Arayüz Alanlarını Yönetme
function switchPage(pageId) {
    // Tüm ana alanları gizle
    document.querySelector('#urunler').style.display = 'none';
    document.querySelector('#sepet-alani').style.display = 'none';
    siparisGecmisiAlani.style.display = 'none';

    // İstenen alanı göster
    if (pageId === 'gecmis') {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert("Sipariş geçmişini görmek için giriş yapmalısınız.");
            switchPage('ana');
            return;
        }
        siparisGecmisiAlani.style.display = 'block';
        renderSiparisGecmisi(); 
    } else {
        // Ana sayfa (Ürünler ve Sepet)
        document.querySelector('#urunler').style.display = 'flex';
        document.querySelector('#sepet-alani').style.display = 'block';
    }
}



function renderSiparisGecmisi() {
    siparislerListesi.innerHTML = '';
    
    // Veriyi çek
    const siparisler = JSON.parse(localStorage.getItem('siparisGecmisi')) || [];
    
    if (siparisler.length === 0) {
        gecmisMesaj.textContent = 'Henüz tamamlanmış bir siparişiniz bulunmamaktadır.';
        return;
    }
    
    gecmisMesaj.textContent = ''; 

    
    siparisler.reverse().forEach(siparis => {
        const kart = document.createElement('div');
        kart.classList.add('siparis-kart');
        kart.dataset.id = siparis.orderId; 

        kart.innerHTML = `
            <div class="siparis-header">
                <p>Sipariş No: <strong>#${siparis.orderId}</strong></p>
                <p>Tarih: <span>${siparis.date}</span></p>
            </div>
            <div class="siparis-body">
                <p>Ürün Sayısı: <strong>${siparis.items.length}</strong></p>
                <p>Toplam Tutar: <strong>${siparis.total.toFixed(2)} TL</strong></p>
            </div>
            <button class="detay-goster-btn" data-id="${siparis.orderId}">Detay Gör</button>
        `;

        siparislerListesi.appendChild(kart);
    });
}


// Detay Görüntüleme Mekanizması
function showSiparisDetay(orderId) {
    const orderIdNumber = Number(orderId);
    const siparisler = JSON.parse(localStorage.getItem('siparisGecmisi')) || [];
    const siparis = siparisler.find(o => o.orderId === orderIdNumber);

    if (!siparis) {
        alert('Sipariş detayı bulunamadı!');
        return;
    }


    detayOrderId.textContent = siparis.orderId;
    detayDate.textContent = siparis.date;
    detayAddress.textContent = siparis.shipment.address;
    detayTotal.textContent = siparis.total.toFixed(2);
    detayUrunlerListesi.innerHTML = '';
    
    // Ürünleri listele (İç İçe Döngü)
    siparis.items.forEach(item => {
        const urunSatir = document.createElement('p');
        urunSatir.style.margin = '5px 0';
        urunSatir.innerHTML = `
            <strong>${item.ad}</strong> x ${item.adet} adet (${(item.fiyat * item.adet).toFixed(2)} TL)
        `;
        detayUrunlerListesi.appendChild(urunSatir);
    });

    
    formContainer.style.display = 'flex';
    detayModal.style.display = 'flex';
}


// ==========================================================
// OLAY DİNLEYİCİLER (Event Listeners)
// ==========================================================

// 5. GÜN: Sepete Ekle
urunlerKapsayici.addEventListener('click', function(e) {
    if (e.target.classList.contains('siparis-btn')) {
        const urunID = e.target.dataset.id;
        sepeteUrunEkle(urunID); 
    }
});

// 8. GÜN: Sepet Yönetimi (Azaltma, Artırma, Silme)
sepetListesiKapsayici.addEventListener('click', function(e) {
    const urunID = e.target.dataset.id;
    
    if (!urunID) return; 

    if (e.target.classList.contains('arttir-btn')) {
        sepeteUrunEkle(urunID);
    } else if (e.target.classList.contains('azalt-btn')) {
        sepettenAzalt(urunID);
    } else if (e.target.classList.contains('sil-btn')) {
        sepettenSil(urunID);
    }
});

// 9. GÜN: Form Gönderme
submitRegisterBtn.addEventListener('click', handleRegister);
submitLoginBtn.addEventListener('click', handleLogin);

// 9, 10, 11, 17. GÜN: Modal Kapatma Butonları (Tüm formları kapatır)
closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        checkoutModal.style.display = 'none';
        detayModal.style.display = 'none'; // Detay modalı kapat
        formContainer.style.display = 'none';
        
        // 17. Gün Eklentisi: Form içeriğini ve spinner'ı sıfırla
        // loading-spinner div'i HTML'inizde zaten var.
        const loadingSpinnerDiv = document.querySelector('#checkout-form-modal #loading-spinner');
        if (loadingSpinnerDiv) loadingSpinnerDiv.style.display = 'none';
        
    });
});

// 10. GÜN: Sipariş Tamamlama Modalını Açma
if (tamamlaBtn) { 
    tamamlaBtn.addEventListener('click', function() {
        if (sepet.length === 0) {
            alert("Sipariş vermek için sepetinizde ürün olmalı!");
            return;
        }
        formContainer.style.display = 'flex';
        checkoutModal.style.display = 'flex';
        checkoutMessage.textContent = ''; 
    });
}

// 10. GÜN: Siparişi Onaylama
submitCheckoutBtn.addEventListener('click', completeOrder);

// 11. GÜN: Sipariş Geçmişi Detay Görüntüleme Delegasyonu
siparislerListesi.addEventListener('click', function(e) {
    if (e.target.classList.contains('detay-goster-btn')) {
        const orderId = e.target.dataset.id;
        showSiparisDetay(orderId);
    }
});

// 11. GÜN: Sayfa Başlığına Tıklama (Ana Sayfaya Dönüş)
baslik.addEventListener('click', function() {
    switchPage('ana');
});

// ==========================================================
// BAŞLANGIÇ ÇAĞRILARI
// ==========================================================

// 7. GÜN: Sepeti yükler
sepetiGuncelle(); 

// 9. GÜN: Oturum durumunu kontrol eder
renderSessionState();
