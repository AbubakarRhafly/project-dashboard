// src/Data/Dummy.js
export const dummyUser = {
  email: "admin@mail.com",
  password: "123456",
  name: "Admin",
};

// ⬇️ perhatikan penulisan persis "mahasiswalist" (lowercase semua)
export const mahasiswalist = [
  { nim: "A11.2023.12345", nama: "Della Septi", status: false },
  { nim: "A11.2023.15240", nama: "Abubakar Rhafly Eka Putera", status: false },
  { nim: "A11.2023.56789", nama: "Abujibril Jizze", status: false },
];

// opsional: default export kalau mau
export default { dummyUser, mahasiswalist };
