using DbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    class JQB_UserBLL
    {
        /// <summary>
        /// 根据手机号获取用户
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public JQB_User GetUserByMobile(string mobile)
        {
            //return JqbUserRepostory.GetUserByMobile(mobile) ?? new JQB_User();
            return null;
        }

        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="vcAccount"></param>
        /// <param name="vcPwd"></param>
        /// <returns></returns>
        public JQB_User CheckLogin(string vcAccount, string vcPwd)
        {
            //var user = JqbUserRepostory.GetUser(vcAccount, DESEncrypt.GetMD5String(vcPwd)) ?? new JQB_User();
            //return user;
            return null;
        }

        /// <summary>
        /// 更新用戶信息
        /// </summary>
        /// <param name="jqbUser"></param>
        /// <returns></returns>
        public int Update(JQB_User jqbUser)
        {
            //return JqbUserRepostory.Update(jqbUser);
            return 0;
        }
    }
}
