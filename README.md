# SkillTrust Academy — Digital Certificate Verification

โปรเจกต์ React + Vite + Solidity สำหรับออกและตรวจสอบใบรับรองบน Ethereum Sepolia Testnet ตามโจทย์ที่ 3

## 1) Deploy Smart Contract ด้วย Remix

1. เปิด https://remix.ethereum.org
2. สร้างไฟล์ `SkillTrustCertificates.sol` แล้วคัดลอกเนื้อหาจาก `contracts/SkillTrustCertificates.sol`
3. ในแท็บ **Solidity Compiler** เลือก Compiler 0.8.20 หรือใหม่กว่าที่รองรับ `^0.8.20` แล้ว Compile
4. เปิด MetaMask เลือก **Sepolia Test Network** และเตรียม Sepolia ETH จาก faucet สำหรับ gas
5. ในแท็บ **Deploy & Run Transactions** เลือก Environment: **Injected Provider - MetaMask**
6. ตรวจสอบว่า MetaMask เชื่อมกับ Sepolia และ Deploy สัญญา `SkillTrustCertificates` (ไม่ต้องใส่ VALUE)
7. คัดลอก **Deployed Contract Address** จาก Remix

> ผู้ Deploy จะเป็น `admin` โดยอัตโนมัติ และสามารถสร้างหลักสูตร เพิกถอนใบรับรอง และอนุญาตผู้ออกใบรับรองรายอื่นได้

## 2) สร้าง Infura Project

1. ไปที่ https://developer.metamask.io/ (MetaMask Developer / Infura)
2. สร้าง API key สำหรับ Ethereum Sepolia
3. คัดลอก Project ID / API Key สำหรับ RPC
4. สร้างไฟล์ `.env` ในโฟลเดอร์หลัก โดยคัดลอกจาก `.env.example` และแทนค่าจริง:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_INFURA_PROJECT_ID=YourInfuraProjectId
VITE_CHAIN_ID=11155111
```

**สำคัญ:** ตัวแปร `VITE_` จะถูกฝังใน frontend และมองเห็นได้โดยผู้ใช้เว็บไซต์ อย่าใส่ private key, seed phrase หรือ Infura API secret ลงใน `.env` ที่ frontend อ่านได้ ตั้งค่า domain allowlist / API restrictions ในผู้ให้บริการ RPC ตามความเหมาะสม

## 3) รัน React Vite

ต้องมี Node.js 18+ (แนะนำ 20 LTS)

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดง เช่น http://localhost:5173

## 4) วิธีทดสอบครบทุกฟังก์ชัน

1. เชื่อมต่อ MetaMask ด้วยบัญชีที่ Deploy Smart Contract (Sepolia)
2. ไปที่ **จัดการหลักสูตร** สร้าง `WEB3-101` / `Blockchain Fundamentals`
3. ไปที่ **กำหนดสิทธิ์ผู้ออก** เพื่ออนุญาตบัญชีอื่น (ไม่บังคับ เพราะ admin ออกได้อยู่แล้ว)
4. เตรียม PDF ใบรับรองที่มีชื่อผู้รับและรายละเอียดจริงไว้บนเครื่อง
5. ไปที่ **ออกใบรับรอง** กรอก `ST-2026-0001`, หลักสูตร, Wallet ของผู้รับ และเลือกไฟล์ PDF แล้วกดยืนยันธุรกรรมใน MetaMask
6. ไปที่ **ตรวจสอบใบรับรอง** ใส่รหัส `ST-2026-0001` และแนบ PDF เดิมเพื่อยืนยันว่า Hash ตรงกัน
7. ทดลองแก้ไข PDF แล้วตรวจสอบอีกครั้ง — ระบบควรแจ้งว่า Hash ไม่ตรงกัน
8. ลองเปิดลิงก์จาก QR Code — จะเข้าสู่หน้าค้นหาด้วยรหัสใบรับรอง (หากยังไม่ได้แนบไฟล์ จะตรวจสอบได้เฉพาะสถานะ ไม่ใช่ความถูกต้องของไฟล์)
9. เชื่อม MetaMask ด้วย Wallet ของผู้รับ และเปิด **ใบรับรองของฉัน**
10. กลับมาบัญชี admin และเพิกถอนใบรับรอง แล้วตรวจสอบใหม่ — ต้องแสดงสถานะเพิกถอน
11. ทดลองใช้ Wallet ที่ไม่มีสิทธิ์เรียก `issueCertificate` / `revokeCertificate` ใน Remix — ธุรกรรมต้อง revert
12. ทดลองออกใบรับรองด้วยรหัสซ้ำ — ธุรกรรมต้อง revert

## 5) โครงสร้างไฟล์

```text
skilltrust-certificate/
├── contracts/
│   └── SkillTrustCertificates.sol
├── src/
│   ├── App.jsx
│   ├── contract.js
│   ├── main.jsx
│   └── style.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## ขอบเขตและข้อควรทราบ

- โค้ดนี้เป็น **MVP สำหรับการศึกษา** ไม่ใช่ระบบที่ผ่าน security audit
- ใช้ **SHA-256 ของไบต์ไฟล์ PDF** (`crypto.subtle.digest`) และบันทึก `bytes32` บนเชน ไฟล์ PDF ที่มีการเปลี่ยนแม้เพียงหนึ่งไบต์จะให้ Hash ต่างกัน
- **ไม่อัปโหลด PDF** หรือชื่อผู้รับไปยัง Blockchain; ข้อมูลบนเชนคือ certificate ID, course code, recipient wallet, document hash, timestamp และ revoked status
- รหัสใบรับรองและรายละเอียดหลักสูตรเป็นข้อมูลสาธารณะ จึงไม่ควรใส่ข้อมูลส่วนบุคคลในช่องเหล่านี้
- Wallet address อาจเชื่อมโยงกับตัวบุคคลได้ ควรขอความยินยอมและพิจารณาความเป็นส่วนตัวก่อนใช้งานจริง
- หน้าตรวจสอบด้วยรหัสเพียงอย่างเดียวบอกได้ว่ามีใบรับรองและสถานะอย่างไร แต่ **ไม่พิสูจน์ว่า PDF ที่ผู้ตรวจถืออยู่ตรงกับต้นฉบับ** จนกว่าจะเลือก PDF เพื่อเทียบ Hash
- QR Code สร้างจาก URL ของเว็บไซต์ที่เปิดอยู่ หากเปิดบน localhost โทรศัพท์เครื่องอื่นจะเข้าถึงไม่ได้ ต้อง deploy frontend ไปยัง URL สาธารณะก่อน
- ระบบนี้ไม่สร้าง PDF อัตโนมัติ ต้องเตรียม PDF เองก่อนออกใบรับรอง และไม่มี backend สำหรับจัดเก็บเอกสารหรือข้อมูลผู้เรียน
- Dashboard ของผู้รับอ่านรายการ ID จาก Smart Contract จึงไม่ต้องใช้ฐานข้อมูลแยกสำหรับรายการใบรับรอง
- หากต้องการให้ผู้อื่นตรวจสอบหลักสูตรและการออกใบรับรองได้อย่างมีความหมาย ควรเพิ่มการยืนยันตัวตนองค์กรที่ออกใบรับรอง และกำหนดนโยบายการเข้าถึงไฟล์ PDF นอกเชน

## หมายเหตุการแก้ Solidity Compiler Error

เวอร์ชันนี้แก้ชนิดข้อมูล `indexed` ของ Events `CourseCreated`, `CertificateIssued` และ `CertificateRevoked` เป็น `bytes32` ให้ตรงกับ `keccak256(bytes(...))` แล้ว หากเคย Deploy เวอร์ชันก่อนหน้า ให้ Deploy เวอร์ชันนี้ใหม่ และใช้ Address ใหม่ใน `.env` การ Verify บน Etherscan ต้องใช้ source และ compiler settings ที่ตรงกับตอน Deploy จริง

## แยกสิทธิ์การใช้งานบนเว็บไซต์

- ผู้เยี่ยมชม: หน้า **ภาพรวมระบบ** และ **ตรวจสอบใบรับรอง** โดยไม่ต้องเชื่อม Wallet
- ผู้เรียน: เชื่อม Wallet แล้วเปิด **ใบรับรองของฉัน**
- ผู้ดูแล (Wallet ที่ Deploy): เชื่อม Wallet แล้วเมนู **จัดการหลักสูตร**, **ออกใบรับรอง**, **เพิกถอนใบรับรอง**, **กำหนดสิทธิ์ผู้ออก** จะปรากฏในแถบด้านซ้ายและทางลัดในหน้าแรก
- Issuer ที่ Admin อนุญาต: เห็นเมนู **ออกใบรับรอง** แต่ไม่สามารถสร้างหลักสูตรหรือเพิกถอน

หากเชื่อม Wallet แล้วไม่เห็นเมนู Admin ให้ตรวจสอบว่าเป็นบัญชีเดียวกับที่ Deploy และ `.env` ชี้ Contract Address บน Sepolia ที่ถูกต้อง
