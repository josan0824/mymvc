using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class DbDateTime
    {
        /// <summary>
        /// 数据库默认时间（1900-01-01 00:00:00.000）
        /// </summary>
        public static DateTime DefualtTime
        {
            get {
                return new DateTime(1900, 1, 1);
            }
        }

    }
}
