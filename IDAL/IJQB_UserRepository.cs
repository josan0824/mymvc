using DbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAL
{
    public interface IJQB_UserRepository
    {
        JQB_User GetUser(string vcAccount, string vcPwd);
    }
}
