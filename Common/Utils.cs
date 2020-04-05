using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    /// <summary>
    /// 帮助类
    /// </summary>
    public class Utils
    {
        /// <summary>
        /// Base64解码
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string Base64Decode(string data)
        {
            string decode = "";
            try
            {
                byte[] datas = System.Convert.FromBase64String(data);
                decode = System.Text.Encoding.GetEncoding("gb2312").GetString(datas);
                return decode;
            }
            catch (Exception ex)
            {
                return decode;
            }
        }
    }
}
