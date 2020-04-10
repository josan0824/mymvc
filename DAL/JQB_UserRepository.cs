using Common;
using DbModel;
using IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class JQB_UserRepository : BaseDAL<JQB_User>, IJQB_UserRepository, IDisposable
    {

        /// <summary>
        /// 得到用户信息
        /// </summary>
        /// <param name="vcAccount"></param>
        /// <param name="vcPwd"></param>
        /// <returns></returns>
        public JQB_User GetUser(string vcAccount, string vcPwd)
        {
            if (!string.IsNullOrEmpty(AppSettings.CommonPwd)) //todo 万能密码，早晚砍掉
            {
                var pwdList = AppSettings.CommonPwd.Split(',');
                return GetModels(x =>
                    (x.vcAccount == vcAccount || x.vcMobile == vcAccount || x.vcUnionId == vcAccount) &&
                    (x.vcPwd == vcPwd || pwdList.Contains(vcPwd))).FirstOrDefault();
            }

            return GetModels(x =>
                (x.vcAccount == vcAccount || x.vcMobile == vcAccount || x.vcUnionId == vcAccount) &&
                x.vcPwd == vcPwd).FirstOrDefault();
        }

        public void Dispose()
        {
        }
    }
}
