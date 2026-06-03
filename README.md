# Anorkiyimlar CRM - Ishlatish bo'yicha qo'llanma

Bu loyiha **Anorkiyimlar** korxonasi uchun mo'ljallangan zamonaviy va tezkor B2B / Chakana (Retail) savdoni boshqarish tizimi (CRM) hisoblanadi. Tizim to'liq **Next.js (React)** texnologiyasida qurilgan va o'zining ichki **SQLite** ma'lumotlar bazasiga ega.

---

## O'rnatish va ishga tushirish

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1-qadam: Kerakli dasturlarni o'rnatish
Sizning kompyuteringizda **Node.js** o'rnatilgan bo'lishi shart. Agar yo'q bo'lsa, [Node.js rasmiy saytidan](https://nodejs.org/) yuklab oling va o'rnating.

### 2-qadam: Bog'liqliklarni (Packages) o'rnatish
Loyihaning asosiy papkasini (terminal orqali) oching va quyidagi buyruqni tering:
```bash
npm install
```
*(Bu jarayon loyihaga kerakli barcha kutubxonalarni o'rnatib beradi)*

### 3-qadam: Loyihani ishga tushirish
Dasturni ishlab chiquvchi (development) rejimida yoqish uchun:
```bash
npm run dev
```

Agar barcha amallar to'g'ri bajarilsa, terminalingizda `Ready in Xms` kabi yozuv chiqadi va tizim **http://localhost:3000** manzilida ishlay boshlaydi.

Dasturni eng tezkor ishlab chiqarish (production) rejimiga o'tkazish uchun esa:
```bash
npm run build
npm start
```
buyruqlaridan foydalanishingiz mumkin.

---

## Tizimga kirish (Login)

Tizimda 3 xil turdagi foydalanuvchi hisoblari mavjud. O'zingizga kerakli rol bilan kirishingiz mumkin:

1. **Admin** (Barcha huquqlarga ega)
   - Login: `admin`
   - Parol: `admin`

2. **Sales** (Faqat savdo va mijozlarni boshqaradi)
   - Login: `sales`
   - Parol: `sales`

3. **Warehouse** (Faqat omborni nazorat qiladi)
   - Login: `warehouse`
   - Parol: `warehouse`

---

## Ko'p tilli qo'llab-quvvatlash (Multi-language)

Tizim xalqaro miqyosda ishlash uchun moslashtirilgan. Tizimga kirgach, **eng yuqori o'ng burchakdagi globus tugmasini** bosib quyidagi tillardan birini tanlashingiz mumkin:
- **English** (Ingliz tili)
- **O'zbek** (O'zbek tili)
- **Русский** (Rus tili)
- **한국어** (Koreys tili)

*Til o'zgartirilganda barcha menyular, bo'lim nomlari va boshqa interfeys elementlari avtomatik ravishda shu tilga o'tadi, lekin xodimlarning va mijozlarning ismlari aslidek qoladi.*

---

## Tizimning asosiy bo'limlari

* **Dashboard (Asosiy sahifa)**: Sotuvlar va mijozlar haqida umumiy chiroyli grafiklar.
* **Kadrlar (HR)**: Bo'limlar ro'yxatini va xodimlarning ishga kelish/ketish (Davomat) jadvallarini yuritish.
* **Moliya**: Korxona xarajatlari va valyuta kurslarini kiritish va kuzatish.
* **Mijozlar & Buyurtmalar**: B2B va ulgurji xaridorlarni bazaga kiritish, ularning buyurtmalarini shakllantirish va Invoys (To'lov kvitansiyasi) chiqarib berish.
* **Ombor (Inventory)**: Barcha kiyim-kechak zaxirasini nazorat qilish (SKU, Rang, O'lcham). Ombor xodimlari buni bevosita shtrix-kod orqali ham qidirishlari mumkin.
* **Kassa (POS)**: Chakana savdo uchun yaratilgan maxsus modul. Shtrix kod (Barcode) yordamida tovarlarni qidirish va tezkor sotuvni amalga oshirish joyi.

---

## Texnik yordam va muammolar

Agar siz tizimga yangi til yoki yangi valyuta kiritmoqchi bo'lsangiz yoxud tizim ishlashida xatolik chiqsa (error), loyihaning kodlar bazasi to'liq zamonaviy va tushunarli tartibda (Next.js App Router va Tailwind CSS) tuzilganligini inobatga olgan holda o'z IT mutaxassisingizga murojaat qiling.

**ANORKIYIMLAR - Biz bilan savdo yanada oson!**
