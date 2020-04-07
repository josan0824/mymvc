using DbModel;
using IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class JQB_UserRepository : IJQB_UserRepository, IDisposable
    {

        /// <summary>
        /// 得到用户信息
        /// </summary>
        /// <param name="vcAccount"></param>
        /// <param name="vcPwd"></param>
        /// <returns></returns>
        public JQB_User GetUser(string vcAccount, string vcPwd)
        {
            using (DbContext dbNew = new Es )
            { 
            
            }

                return null;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
