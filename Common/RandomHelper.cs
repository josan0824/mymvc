using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class RandomHelper
    {
        /// <summary>
        /// 取随机数
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string BuildRandomStr(int length)
        {
            Random rand = new Random();
            int num = rand.Next();
            string str = num.ToString();
            if (str.Length > length)
            {
                str = str.Substring(0, length);
            }
            else if (str.Length < length)
            {
                int n = length - str.Length;

                while (n > 0)
                {
                    str.Insert(0, "0");
                    n--;
                }
            }
            return str;
        }

        /// <summary>
        /// Guid唯一标识
        /// </summary>
        /// <returns></returns>
        public static string GetUUID()
        {
            string _guid = Guid.NewGuid().ToString();
            return _guid.Replace("-", "").ToString();
        }

        /// <summary>
        /// 取时间戳生成随即数,替换交易单号中的后10位流水号
        /// </summary>
        /// <returns></returns>
        public static UInt32 UnixStamp()
        {
            TimeSpan ts = DateTime.Now - TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            return Convert.ToUInt32(ts.TotalSeconds);
        }

        /// <summary>
        /// 产生随机数字字符串
        /// </summary>
        /// <returns></returns>
        public static string RandomStr(int Num)
        {
            int number;
            char code;
            string returnCode = String.Empty;
            Random random = new Random();
            for (int i = 0; i < Num; i++)
            {
                number = random.Next();
                code = (char)('0' + (char)(number % 10));
                returnCode += code.ToString();
            }
            return returnCode;
        }

        /// <summary>
        /// 生成随机数字字符串包含字母
        /// </summary>
        /// <param name="int_NumberLength">数字长度</param>
        /// <returns></returns>
        public static string GetRandomCharacterString(int int_NumberLength)
        {
            return GetRandomNumberString(int_NumberLength, false);
        }

        /// <summary>
        /// 生成随机数字字符串包含字母
        /// </summary>
        /// <param name="int_NumberLength">数字长度</param>
        /// <returns></returns>
        public static string GetRandomNumberString(int int_NumberLength)
        {
            return GetRandomNumberString(int_NumberLength, true);
        }

        /// <summary>
        /// 生成随机数字字符串
        /// </summary>
        /// <param name="int_NumberLength">数字长度</param>
        /// <param name="onlyNumber">是否是纯数字</param>
        /// <returns></returns>

        public static string GetRandomNumberString(int int_NumberLength, bool onlyNumber)
        {
            Random random = new Random();
            return GetRandomNumberString(int_NumberLength, onlyNumber, random);
        }

        /// <summary>
        /// 生成随机数字字符串
        /// </summary>
        /// <param name="int_NumberLength">数字长度</param>
        /// <param name="onlyNumber">是否是纯数字</param>
        /// <returns></returns>

        public static string GetRandomNumberString(int int_NumberLength, bool onlyNumber, Random random)
        {
            string strings = "123456789";
            if (!onlyNumber) strings += "abcdefghjkmnpqrstuvwxyz";
            char[] chars = strings.ToCharArray();
            string returnCode = string.Empty;
            for (int i = 0; i < int_NumberLength; i++)
                returnCode += chars[random.Next(0, chars.Length)].ToString();
            return returnCode;
        }

        /// <summary>
        /// 生成产品订单号，全站统一格式
        /// </summary>
        /// <returns></returns>
        public static string GetProductOrderNum()
        {
            return DateTime.Now.ToString("yyyyMMddHHmmss") + GetRandomNumberString(4, true);
        }
    }
}
