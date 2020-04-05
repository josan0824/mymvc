using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//引入System.Web
using System.Web.Configuration;

namespace Common
{
    public class AppSettings
    {
        public static readonly string CommonPwd = WebConfigurationManager.AppSettings["CommonPwd"] ?? "";
    }
}
