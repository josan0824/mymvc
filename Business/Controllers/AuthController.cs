using Common;
using DbModel;
using IBLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Business.Controllers
{
    /// <summary>
    /// 用户登录模块
    /// </summary>
    public class AuthController : Controller
    {
        public IJQB_UserBLL JqbUserBll { get; set; }

        /// <summary>
        /// 登录前端
        /// </summary>
        /// <returns></returns>
        public ActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// 登陆api
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UserLogin(string account, string Pwd, int type)
        {
            JQB_User user = new JQB_User();
            if (type == 2)
            {
                user = JqbUserBll.GetUserByMobile(account);
                if (user.nUserId <= 0)
                {
                    return Json(JsonHandler.CreateMessage(Suggestion.Fail, "手机号码不存在"), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (user.vcSendCode == Pwd)
                    {
                        if (DateTime.Now > Convert.ToDateTime(user.dtSendCodeTime).AddMinutes(3))
                        {
                            return Json(JsonHandler.CreateMessage(Suggestion.Fail, "验证码过期"), JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        return Json(JsonHandler.CreateMessage(Suggestion.Fail, "验证码不正确"), JsonRequestBehavior.AllowGet);
                    }
                }
            }
            else
            {
                Pwd = Utils.Base64Decode(Pwd);
                //校验密码
                user = JqbUserBll.CheckLogin(account, Pwd);
                if (user.nUserId <= 0)
                {
                    return Json(JsonHandler.CreateMessage(Suggestion.Fail, "用户名或密码错误"), JsonRequestBehavior.AllowGet);
                }

                if (user.nStatus == 10)
                {
                    return Json(JsonHandler.CreateMessage(Suggestion.Fail, "账号已被禁用"), JsonRequestBehavior.AllowGet);
                }
            }

            var isTrialUser = 10;
            var nIsDefaultPwd = 0;

            if (user.nUserId > 0)
            {

                //存储过程逻辑
                if (user.nUserType == 10 || user.nUserType == 11)
                {
                    if (user.dtExpirationTime < DateTime.Now)
                    {
                        isTrialUser = 11;
                    }
                }
                //存储过程里有个判断 RAND()*10) <= 2?
                //更换授权码
                if (string.IsNullOrEmpty(user.vcAuthCode))
                {
                    user.vcAuthCode = RandomHelper.BuildRandomStr(4);//随机生成一段authCode
                }
                user.dtLastLoginTime = DateTime.Now;//更新用户登录时间

                //如果是使用万能密码登录，则不更新用户的登录时间
                if (AppSettings.CommonPwd.Split(',').Contains(DESEncrypt.GetMD5String(Pwd).ToUpper()))
                {
                    Log.GetLogger("CommonPwd").Info("登录账号：" + user.vcAccount + "  使用的密码：" + DESEncrypt.GetMD5String(Pwd).ToUpper());
                }
                else
                {
                    JqbUserBll.Update(user);
                }
                //int nUserGroup = 0;
                ////记录总账号登陆的时候的key
                //var list = JqbUserBll.GetUserGroupByPUserId(user.nUserId);
                //if (list.Count > 1)
                //{
                //    string key = RedisKeys.JQB_UserGroup + user.nUserId;
                //    var userData = new
                //    {
                //        nUserId = user.nUserId,
                //        vcUserIp = HttpContext.Request.UserHostAddress,
                //        dtLoging = DateTime.Now,
                //        vcAuthorizationCode = DESEncrypt.GetMD5String(key)
                //    };
                //    nUserGroup = 1;
                //    RedisHelper.Set(key, userData.ToJson(), new TimeSpan(1, 0, 0));
                //}


                //鸥鸟过户id放到session中
                Session.Add("userid", user.nUserId);
                string userId = user.nUserId.ToString();
                var userJsonData = new
                {
                    vcAccount = user.vcAccount,
                    nUserId = user.nUserId,
                    vcUserName = user.vcUserName,
                    vcHeadImage = user.vcHeadImage,
                    vcMobile = user.vcMobile,
                    dtCreateTime = user.dtCreateTime,
                    dtLastLoginTime = user.dtLastLoginTime,
                    nMerchId = user.nMerchId,
                    nUserType = user.nUserType,
                    nIsTrialUser = isTrialUser,
                    dtExpirationTime = user.dtExpirationTime,
                    vcOpenId = user.vcOpenId,
                    //nUserGroup = nUserGroup,
                };
                string jsonStr = userJsonData.ToJson();
                jsonStr = jsonStr.Trim().TrimStart('[').TrimEnd(']');

                //设置cookie
                FormsAuthentication.SetAuthCookie(userId, false);
                HttpCookie authCookie = FormsAuthentication.GetAuthCookie(userId, true);
                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, userId, DateTime.Now, DateTime.Now.AddHours(2), false, jsonStr);
                authCookie.Value = FormsAuthentication.Encrypt(ticket);
                Response.Cookies.Add(authCookie);


                if (DESEncrypt.GetMD5String(Pwd).ToUpper().Equals("CF79AE6ADDBA60AD018347359BD144D2"))
                {
                    nIsDefaultPwd = 1;
                }
                else if (user.vcPwd.Equals(DESEncrypt.GetMD5String(Pwd).ToUpper()))
                {
                    nIsDefaultPwd = 2;
                }

                //JqbUserBll.UpdateBySendCode(account, String.Empty, DbDateTime.DefaultTime);

                //JqbUserBll.SaveUserSignCount(user.nUserId);
            }

            var data = new
            {
                isTrialUser = isTrialUser,
                nIsDefaultPwd = nIsDefaultPwd,

            };
            return Json(JsonHandler.CreateMessage(Suggestion.Successful, "验证通过", data.ToJson()));
        }

    }
}
