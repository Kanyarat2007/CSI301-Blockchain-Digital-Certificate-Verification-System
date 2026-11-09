import { ethers } from "ethers";
export const ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111);
const INFURA_ID = import.meta.env.VITE_INFURA_PROJECT_ID || "";
const RPC = `https://sepolia.infura.io/v3/${INFURA_ID}`;
export const ABI = [
  "function admin() view returns (address)",
  "function issuers(address) view returns (bool)",
  "function setIssuer(address,bool)",
  "function createCourse(string,string,string)",
  "function getCourses() view returns (tuple(string code,string title,string description,bool exists)[])",
  "function issueCertificate(string,string,address,bytes32)",
  "function getCertificate(string) view returns (tuple(string certificateId,string courseCode,address recipient,bytes32 documentHash,uint64 issuedAt,bool revoked,bool exists))",
  "function verifyCertificate(string,bytes32) view returns (bool valid,bool revoked,bool hashMatches)",
  "function getWalletCertificateIds(address) view returns (string[])",
  "function revokeCertificate(string)",
];

// ใช้ไปก่อน ระหว่างรอ influra
export function readContract() {
  if (!ethers.isAddress(ADDRESS)) {
    throw Error("Contract Address ไม่ถูกต้อง");
  }

  if (!window.ethereum) {
    throw Error("ไม่พบ MetaMask");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  return new ethers.Contract(ADDRESS, ABI, provider);
}

// export function readContract() {
//   if (
//     !ethers.isAddress(ADDRESS) ||
//     !INFURA_ID ||
//     INFURA_ID === "YOUR_INFURA_PROJECT_ID"
//   )
//     throw Error(
//       "กรุณาตั้งค่า VITE_CONTRACT_ADDRESS และ VITE_INFURA_PROJECT_ID ในไฟล์ .env",
//     );
//   return new ethers.Contract(
//     ADDRESS,
//     ABI,
//     new ethers.JsonRpcProvider(RPC, CHAIN_ID),
//   );
// }

export async function connectWallet() {
  if (!window.ethereum) throw Error("ไม่พบ MetaMask กรุณาติดตั้งส่วนขยายก่อน");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID)
    throw Error(
      `กรุณาเปลี่ยนเครือข่าย MetaMask เป็น Sepolia (Chain ID ${CHAIN_ID})`,
    );
  return { signer: await provider.getSigner(), provider };
}
export async function writeContract() {
  if (!ethers.isAddress(ADDRESS))
    throw Error("ยังไม่ได้ตั้งค่า Contract Address");
  const { signer } = await connectWallet();
  return new ethers.Contract(ADDRESS, ABI, signer);
}
export async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return (
    "0x" +
    [...new Uint8Array(digest)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}
export const shortAddress = (s) =>
  s ? `${s.slice(0, 6)}...${s.slice(-4)}` : "";
export function errorMessage(error) {
  return (
    error?.shortMessage || error?.reason || error?.message || "เกิดข้อผิดพลาด"
  );
}
