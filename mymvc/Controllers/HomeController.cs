using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mymvc.Controllers
{
    /// <summary>
    /// M模式：类，这些类表示应用程序的数据，并使用验证逻辑来强制执行该数据的业务规则。
    /// V视图：应用程序用于动态生成 HTML 响应的模板文件。
    /// C控制器：用于处理传入浏览器请求、检索模型数据，然后指定将响应返回到浏览器的视图模板的类。
    /// </summary>
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}