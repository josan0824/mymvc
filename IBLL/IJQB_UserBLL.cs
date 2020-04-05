using DbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IBLL
{
    public interface IJQB_UserBLL
    {
        JQB_User GetUserByMobile(string mobile);

        JQB_User CheckLogin(string vcAccount, string vcPwd);

        int Update(JQB_User jqbUser);
    }
}
