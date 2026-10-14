import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("8080808080808080");
const iv = CryptoJS.enc.Utf8.parse("8080808080808080");

export function encryptApplicationNumber(
  applicationNumber: string
): string {
  const queryString =
    `Type=1&ApplicationNo=${applicationNumber}&t=uh`;

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(queryString),
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
}
