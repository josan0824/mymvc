using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Security.Cryptography;

namespace Common
{
    public class Encrypt
    {
        //默认密钥向量
        private static readonly byte[] Keys = { 0x12, 0x34, 0x56, 0x78, 0x99, 0xAB, 0xCD, 0xEF };

        /// <summary>
        /// DES加密字符串
        /// </summary>
        /// <param name="encryptString">待加密的字符串</param>
        /// <param name="encryptKey">加密密钥,要求为8位</param>
        /// <returns>加密成功返回加密后的字符串，失败返回源串</returns>
        public static string EncryptDES(string encryptString, string encryptKey)
        {
            try
            {
                byte[] rgbKey = Encoding.UTF8.GetBytes(encryptKey.Substring(0, 8));
                byte[] rgbIV = Keys;
                byte[] inputByteArray = Encoding.UTF8.GetBytes(encryptString);
                DESCryptoServiceProvider dCSP = new DESCryptoServiceProvider();
                MemoryStream mStream = new MemoryStream();
                CryptoStream cStream = new CryptoStream(mStream, dCSP.CreateEncryptor(rgbKey, rgbIV), CryptoStreamMode.Write);
                cStream.Write(inputByteArray, 0, inputByteArray.Length);
                cStream.FlushFinalBlock();
                dCSP.Clear();
                return Convert.ToBase64String(mStream.ToArray());
            }
            catch
            {
                return encryptString;
            }
        }

        /// <summary>
        /// DES解密字符串
        /// </summary>
        /// <param name="decryptString">待解密的字符串</param>
        /// <param name="decryptKey">解密密钥,要求为8位,和加密密钥相同</param>
        /// <returns>解密成功返回解密后的字符串，失败返源串</returns>
        public static string DecryptDES(string decryptString, string decryptKey)
        {
            if (decryptString == null || decryptString.Trim().Length == 0) return "";
            try
            {
                byte[] rgbKey = Encoding.UTF8.GetBytes(decryptKey);
                byte[] rgbIV = Keys;
                byte[] inputByteArray = Convert.FromBase64String(decryptString);
                DESCryptoServiceProvider DCSP = new DESCryptoServiceProvider();
                MemoryStream mStream = new MemoryStream();
                CryptoStream cStream = new CryptoStream(mStream, DCSP.CreateDecryptor(rgbKey, rgbIV), CryptoStreamMode.Write);
                cStream.Write(inputByteArray, 0, inputByteArray.Length);
                cStream.FlushFinalBlock();
                DCSP.Clear();
                return Encoding.UTF8.GetString(mStream.ToArray());
            }
            catch
            {
                return decryptString;
            }
        }

        /// <summary>
        /// SHA256加密
        /// </summary>
        /// <param name="strIN">待加密的字符串</param>
        /// <returns></returns>
        public static string SHA256(string strIN)
        {
            return SHA256(strIN, Encoding.Default.WebName);
        }

        /// <summary>
        /// SHA512加密
        /// </summary>
        /// <param name="strIN">待加密的字符串</param>
        /// <param name="encoding">编码</param>
        /// <returns></returns>
        public static string SHA256(string strIN, string encoding)
        {
            byte[] bytes = Encoding.GetEncoding(encoding).GetBytes(strIN);
            SHA256Managed managed = new SHA256Managed();
            byte[] tmpByte = managed.ComputeHash(bytes);
            managed.Clear();
            return Convert.ToBase64String(tmpByte);
        }

        /// <summary>
        /// SHA512加密
        /// </summary>
        /// <param name="strIN">待加密的字符串</param>
        /// <returns></returns>
        public static string SHA512(string strIN)
        {
            return SHA512(strIN, Encoding.Default.WebName);
        }

        /// <summary>
        /// SHA512加密
        /// </summary>
        /// <param name="strIN">待加密的字符串</param>
        /// <param name="encoding">编码</param>
        /// <returns></returns>
        public static string SHA512(string strIN, string encoding)
        {
            byte[] bytes = Encoding.GetEncoding(encoding).GetBytes(strIN);
            SHA512Managed managed = new SHA512Managed();
            byte[] tmpByte = managed.ComputeHash(bytes);
            managed.Clear();
            return Convert.ToBase64String(tmpByte);
        }

        /// <summary>
        /// MD5_Hash加密
        /// </summary>
        /// <param name="strIn">待加密的字符串</param>
        /// <returns></returns>
        public static string MD5_Hash(string strIn)
        {
            return MD5_Hash(strIn, Encoding.Default.WebName);
        }

        /// <summary>
        /// MD5_Hash加密
        /// </summary>
        /// <param name="strIn">待加密的字符串</param>
        /// <param name="encoding">编码</param>
        /// <returns></returns>
        public static string MD5_Hash(string strIn, string encoding)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] bytesIn = Encoding.GetEncoding(encoding).GetBytes(strIn);
            byte[] bytesOut = md5.ComputeHash(bytesIn);
            string strOut = BitConverter.ToString(bytesOut);
            strOut = strOut.Replace("-", "");
            md5.Clear();
            return strOut;
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="str">待加密的字符串</param>
        /// <returns></returns>
        public static string MD5(string str)
        {
            return MD5(str, Encoding.Default.WebName);
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="str">待加密的字符串</param>
        /// <param name="encoding">编码</param>
        /// <returns></returns>
        public static string MD5(string str, string encoding)
        {
            byte[] bytes = Encoding.GetEncoding(encoding).GetBytes(str);
            MD5 md5 = new MD5CryptoServiceProvider();
            bytes = md5.ComputeHash(bytes);
            string text = "";
            for (int i = 0; i < bytes.Length; i++)
            {
                text = text + bytes[i].ToString("x").PadLeft(2, '0');
            }
            md5.Clear();
            return text;
        }
    }

    /// <summary>
    /// DES加密/解密类。
    /// </summary>
    public class DESEncrypt
    {
        //#region ========加密========

        ///// <summary>
        ///// 加密数据
        ///// </summary>
        ///// <param name="Text"></param>
        ///// <param name="sKey"></param>
        ///// <returns></returns>
        //public static string Encrypt(string Text, string sKey)
        //{
        //    if (Text == "")
        //        return "";
        //    DESCryptoServiceProvider des = new DESCryptoServiceProvider();
        //    byte[] inputByteArray;
        //    inputByteArray = Encoding.Default.GetBytes(Text);
        //    des.Key = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
        //    des.IV = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
        //    System.IO.MemoryStream ms = new System.IO.MemoryStream();
        //    CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
        //    cs.Write(inputByteArray, 0, inputByteArray.Length);
        //    cs.FlushFinalBlock();
        //    StringBuilder ret = new StringBuilder();
        //    foreach (byte b in ms.ToArray())
        //    {
        //        ret.AppendFormat("{0:X2}", b);
        //    }
        //    return ret.ToString();
        //}

        //#endregion ========加密========

        //#region ========解密========

        ///// <summary>
        ///// 解密数据
        ///// </summary>
        ///// <param name="Text"></param>
        ///// <param name="sKey"></param>
        ///// <returns></returns>
        //public static string Decrypt(string Text, string sKey)
        //{
        //    if (Text == "")
        //        return "";
        //    DESCryptoServiceProvider des = new DESCryptoServiceProvider();
        //    int len;
        //    len = Text.Length / 2;
        //    byte[] inputByteArray = new byte[len];
        //    int x, i;
        //    for (x = 0; x < len; x++)
        //    {
        //        i = Convert.ToInt32(Text.Substring(x * 2, 2), 16);
        //        inputByteArray[x] = (byte)i;
        //    }
        //    des.Key = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
        //    des.IV = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
        //    System.IO.MemoryStream ms = new System.IO.MemoryStream();
        //    CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
        //    cs.Write(inputByteArray, 0, inputByteArray.Length);
        //    cs.FlushFinalBlock();
        //    return Encoding.Default.GetString(ms.ToArray());
        //}

        //#endregion ========解密========

        /// <summary>
        /// 获取字符串的MD5
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string GetMD5String(string str)
        {
            MD5 md5 = MD5.Create();
            byte[] data = Encoding.UTF8.GetBytes(str);
            byte[] data2 = md5.ComputeHash(data);
            return GetbyteToString(data2);
        }

        /// <summary>
        /// byte数组转换成十六进制字符串
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        private static string GetbyteToString(byte[] data)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sb.Append(data[i].ToString("x2"));
            }
            return sb.ToString();
        }
    }
}
